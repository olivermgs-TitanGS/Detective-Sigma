import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET /api/progress - Get user's progress
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      include: {
        case: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            difficulty: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST /api/progress - Create/Update progress
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { caseId, status, collectedClues, solvedPuzzles, score, timeSpent } = body;

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_caseId: {
          userId: session.user.id,
          caseId: caseId,
        },
      },
      update: {
        status,
        collectedClues,
        solvedPuzzles,
        score,
        timeSpent,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        caseId,
        status,
        collectedClues,
        solvedPuzzles,
        score,
        timeSpent: timeSpent || 0,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}
