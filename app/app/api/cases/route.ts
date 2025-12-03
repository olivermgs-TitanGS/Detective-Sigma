import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/cases - List all cases (with optional filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const subject = searchParams.get('subject');
    const published = searchParams.get('published');

    const where: any = {};
    
    if (difficulty) where.difficulty = difficulty;
    if (subject) where.subjectFocus = subject;
    if (published !== null) where.published = published === 'true';

    const cases = await prisma.case.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        subjectFocus: true,
        estimatedMinutes: true,
        coverImage: true,
        published: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

// POST /api/cases - Create new case (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newCase = await prisma.case.create({
      data: {
        title: body.title,
        description: body.description,
        difficulty: body.difficulty,
        subjectFocus: body.subjectFocus,
        estimatedMinutes: body.estimatedMinutes,
        coverImage: body.coverImage,
        storyIntro: body.storyIntro,
        learningObjectives: body.learningObjectives,
        skills: body.skills,
        published: body.published || false,
      },
    });

    return NextResponse.json({ case: newCase }, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
