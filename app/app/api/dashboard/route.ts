import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/dashboard - Get dashboard stats for current user
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user's progress
    const progress = await prisma.progress.findMany({
      where: { userId },
      include: {
        case: {
          select: {
            title: true,
            difficulty: true,
            coverImage: true,
          },
        },
      },
    });

    // Calculate stats (only count SOLVED cases for score)
    const solvedProgress = progress.filter(p => p.status === 'SOLVED');
    const casesSolved = solvedProgress.length;
    const totalScore = solvedProgress.reduce((sum, p) => sum + (p.score || 0), 0);
    const totalClues = progress.reduce((sum, p) => {
      const clues = p.cluesCollected as string[] | null;
      return sum + (clues?.length || 0);
    }, 0);

    // Get user's rank (only count SOLVED cases, same as leaderboard)
    const allUsers = await prisma.user.findMany({
      include: {
        progress: {
          where: { status: 'SOLVED' },
        },
      },
    });

    const userScores = allUsers
      .map(user => ({
        userId: user.id,
        totalScore: user.progress.reduce((sum, p) => sum + (p.score || 0), 0),
      }))
      .filter(u => u.totalScore > 0) // Only users with solved cases
      .sort((a, b) => b.totalScore - a.totalScore);

    // Find user's rank (0 if not on leaderboard yet)
    const userRankIndex = userScores.findIndex(u => u.userId === userId);
    const userRank = userRankIndex >= 0 ? userRankIndex + 1 : 0;

    // Get active cases (IN_PROGRESS)
    const activeCases = progress.filter(p => p.status === 'IN_PROGRESS');

    // Get recent activity
    const recentActivity = progress
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        casesSolved,
        totalScore,
        totalClues,
        rank: userRank,
      },
      activeCases,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
