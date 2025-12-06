import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    // Get total cases solved (Progress with status = SOLVED)
    const casesSolved = await prisma.progress.count({
      where: {
        status: 'SOLVED',
      },
    });

    // Get total cases started (IN_PROGRESS or SOLVED)
    const casesStarted = await prisma.progress.count({
      where: {
        status: {
          in: ['IN_PROGRESS', 'SOLVED'],
        },
      },
    });

    // Calculate solve rate (avoid division by zero)
    const solveRate = casesStarted > 0
      ? Math.round((casesSolved / casesStarted) * 100)
      : 0;

    // Get total detectives (users with STUDENT role)
    const detectivesCount = await prisma.user.count({
      where: {
        role: 'STUDENT',
      },
    });

    // Get total published cases available
    const casesAvailable = await prisma.case.count({
      where: {
        status: 'PUBLISHED',
      },
    });

    return NextResponse.json({
      casesSolved,
      solveRate,
      detectivesCount,
      casesAvailable,
      // Metadata
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
