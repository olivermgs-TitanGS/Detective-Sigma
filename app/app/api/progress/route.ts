import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');

    // If caseId provided, get specific progress
    if (caseId) {
      const progress = await prisma.progress.findUnique({
        where: {
          userId_caseId: {
            userId: session.user.id,
            caseId: caseId,
          },
        },
        include: {
          case: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              difficulty: true,
              estimatedMinutes: true,
            },
          },
        },
      });
      return NextResponse.json({ progress });
    }

    // Otherwise get all progress
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
    const { caseId, status, cluesCollected, puzzlesSolved, score, timeSpent, currentSceneIndex } = body;

    // Get existing progress to check if this is a new start
    const existing = await prisma.progress.findUnique({
      where: {
        userId_caseId: {
          userId: session.user.id,
          caseId: caseId,
        },
      },
    });

    const now = new Date();

    // Build update data
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (cluesCollected !== undefined) updateData.cluesCollected = cluesCollected;
    if (puzzlesSolved !== undefined) updateData.puzzlesSolved = puzzlesSolved;
    if (score !== undefined) updateData.score = score;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
    if (currentSceneIndex !== undefined) updateData.currentSceneIndex = currentSceneIndex;
    if (status === 'SOLVED') updateData.completedAt = now;

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_caseId: {
          userId: session.user.id,
          caseId: caseId,
        },
      },
      update: updateData,
      create: {
        userId: session.user.id,
        caseId,
        status: status || 'IN_PROGRESS',
        cluesCollected: cluesCollected || [],
        puzzlesSolved: puzzlesSolved || [],
        score: score || 0,
        timeSpent: timeSpent || 0,
        currentSceneIndex: currentSceneIndex || 0,
        startedAt: now,
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
