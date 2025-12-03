import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/progress - Get user's progress
export async function GET(request: Request) {
  try {
    const session = await auth();

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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { caseId, status, cluesCollected, puzzlesSolved, score } = body;

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
        cluesCollected,
        puzzlesSolved,
        score,
      },
      create: {
        userId: session.user.id,
        caseId,
        status: status || 'NEW',
        cluesCollected: cluesCollected || [],
        puzzlesSolved: puzzlesSolved || [],
        score: score || 0,
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
