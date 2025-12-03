import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/leaderboard - Get global leaderboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const caseId = searchParams.get('caseId');

    // Get top users by total score
    const leaderboard = await prisma.user.findMany({
      take: limit,
      select: {
        id: true,
        username: true,
        studentProfile: {
          select: {
            gradeLevel: true,
          },
        },
        progress: {
          where: caseId ? { caseId } : {},
          select: {
            score: true,
            case: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        progress: {
          _count: 'desc',
        },
      },
    });

    // Calculate total scores
    const leaderboardWithScores = leaderboard.map((user, index) => {
      const totalScore = user.progress.reduce((sum, p) => sum + (p.score || 0), 0);
      const casesSolved = user.progress.filter(p => p.score > 0).length;

      return {
        rank: index + 1,
        username: user.username,
        gradeLevel: user.studentProfile?.gradeLevel || 'N/A',
        totalScore,
        casesSolved,
      };
    });

    // Sort by total score
    leaderboardWithScores.sort((a, b) => b.totalScore - a.totalScore);

    // Update ranks after sorting
    leaderboardWithScores.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return NextResponse.json({ leaderboard: leaderboardWithScores });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
