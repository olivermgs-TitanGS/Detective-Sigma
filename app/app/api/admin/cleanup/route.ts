import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// POST /api/admin/cleanup - Remove duplicate cases
export async function POST() {
  try {
    const session = await auth();

    // Only allow admins
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      );
    }

    // Find all cases grouped by title
    const allCases = await prisma.case.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Group cases by title
    const casesByTitle = new Map<string, typeof allCases>();
    for (const c of allCases) {
      const existing = casesByTitle.get(c.title) || [];
      existing.push(c);
      casesByTitle.set(c.title, existing);
    }

    // Find duplicates (keep first, delete rest)
    const toDelete: string[] = [];
    for (const [title, cases] of casesByTitle) {
      if (cases.length > 1) {
        // Keep the first one (oldest), delete the rest
        const duplicates = cases.slice(1);
        toDelete.push(...duplicates.map((c) => c.id));
        console.log(`[Cleanup] Found ${duplicates.length} duplicates for "${title}"`);
      }
    }

    if (toDelete.length === 0) {
      return NextResponse.json({
        message: 'No duplicate cases found',
        deleted: 0,
      });
    }

    // Delete duplicates (cascade will handle related records)
    const deleted = await prisma.case.deleteMany({
      where: { id: { in: toDelete } },
    });

    return NextResponse.json({
      message: `Deleted ${deleted.count} duplicate cases`,
      deleted: deleted.count,
      deletedIds: toDelete,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// GET /api/admin/cleanup - Preview duplicates without deleting
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      );
    }

    const allCases = await prisma.case.findMany({
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by title
    const casesByTitle = new Map<string, typeof allCases>();
    for (const c of allCases) {
      const existing = casesByTitle.get(c.title) || [];
      existing.push(c);
      casesByTitle.set(c.title, existing);
    }

    // Find duplicates
    const duplicates: { title: string; count: number; ids: string[] }[] = [];
    for (const [title, cases] of casesByTitle) {
      if (cases.length > 1) {
        duplicates.push({
          title,
          count: cases.length,
          ids: cases.map((c) => c.id),
        });
      }
    }

    return NextResponse.json({
      totalCases: allCases.length,
      duplicateGroups: duplicates.length,
      duplicates,
    });
  } catch (error) {
    console.error('Cleanup preview error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
