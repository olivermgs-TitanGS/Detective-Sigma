import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/leaderboard - Get global leaderboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const caseId = searchParams.get('caseId');

    // Build progress filter - only count SOLVED cases
    const progressFilter: any = { status: 'SOLVED' };
    if (caseId) {
      progressFilter.caseId = caseId;
    }

    // Get users who have at least one solved case
    const leaderboard = await prisma.user.findMany({
      where: {
        progress: {
          some: progressFilter,
        },
      },
      select: {
        id: true,
        username: true,
        studentProfile: {
          select: {
            gradeLevel: true,
          },
        },
        progress: {
          where: progressFilter,
          select: {
            score: true,
            status: true,
          },
        },
      },
    });

    // Calculate total scores and sort
    const leaderboardWithScores = leaderboard
      .map((user) => {
        const solvedProgress = user.progress.filter(p => p.status === 'SOLVED');
        const totalScore = solvedProgress.reduce((sum, p) => sum + (p.score || 0), 0);
        const casesSolved = solvedProgress.length;

        return {
          rank: 0,
          username: user.username,
          gradeLevel: user.studentProfile?.gradeLevel || 'N/A',
          totalScore,
          casesSolved,
        };
      })
      .filter(entry => entry.totalScore > 0) // Only show users with points
      .sort((a, b) => b.totalScore - a.totalScore) // Sort by score descending
      .slice(0, limit); // Apply limit after sorting

    // Assign ranks after sorting
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
