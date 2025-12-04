import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/puzzles - Create new puzzle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, title, type, questionText, correctAnswer, hint, options, points } = body;

    if (!caseId || !title) {
      return NextResponse.json(
        { error: 'Case ID and title are required' },
        { status: 400 }
      );
    }

    const puzzle = await prisma.puzzle.create({
      data: {
        caseId,
        title,
        type: type || 'MATH_WORD',
        questionText: questionText || '',
        correctAnswer: correctAnswer || '',
        hint: hint || null,
        options: options || null,
        points: points ?? 10,
      },
    });

    return NextResponse.json({ puzzle });
  } catch (error) {
    console.error('Error creating puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to create puzzle' },
      { status: 500 }
    );
  }
}

// GET /api/admin/puzzles?caseId=xxx - Get puzzles for a case
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    const puzzles = await prisma.puzzle.findMany({
      where: { caseId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ puzzles });
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch puzzles' },
      { status: 500 }
    );
  }
}
