import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET /api/dashboard - Get dashboard stats for current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    
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

    // Calculate stats
    const casesSolved = progress.filter(p => p.status === 'COMPLETED').length;
    const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);
    const totalClues = progress.reduce((sum, p) => sum + (p.collectedClues?.length || 0), 0);

    // Get user's rank
    const allUsers = await prisma.user.findMany({
      include: {
        progress: true,
      },
    });

    const userScores = allUsers.map(user => ({
      userId: user.id,
      totalScore: user.progress.reduce((sum, p) => sum + (p.score || 0), 0),
    }));

    userScores.sort((a, b) => b.totalScore - a.totalScore);
    const userRank = userScores.findIndex(u => u.userId === userId) + 1;

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
