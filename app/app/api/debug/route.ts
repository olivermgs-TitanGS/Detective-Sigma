import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/debug - Debug endpoint to check database state
export async function GET() {
  try {
    // Get all progress records
    const progress = await prisma.progress.findMany({
      include: {
        user: { select: { username: true, email: true } },
        case: { select: { title: true } },
      },
    });

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true },
    });

    // Get all cases
    const cases = await prisma.case.findMany({
      select: { id: true, title: true, status: true },
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      counts: {
        users: users.length,
        cases: cases.length,
        progressRecords: progress.length,
        solvedProgress: progress.filter(p => p.status === 'SOLVED').length,
      },
      users,
      cases,
      progress: progress.map(p => ({
        id: p.id,
        username: p.user.username,
        caseTitle: p.case.title,
        status: p.status,
        score: p.score,
        completedAt: p.completedAt,
      })),
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
