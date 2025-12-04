import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/clues - Create new clue
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sceneId,
      name,
      description,
      imageUrl,
      contentRevealed,
      isHidden,
      requiredPuzzleId,
      positionX,
      positionY,
    } = body;

    if (!sceneId || !name) {
      return NextResponse.json(
        { error: 'Scene ID and name are required' },
        { status: 400 }
      );
    }

    const clue = await prisma.clue.create({
      data: {
        sceneId,
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        contentRevealed: contentRevealed || null,
        isHidden: isHidden ?? false,
        requiredPuzzleId: requiredPuzzleId || null,
        positionX: positionX ?? null,
        positionY: positionY ?? null,
      },
    });

    return NextResponse.json({ clue });
  } catch (error) {
    console.error('Error creating clue:', error);
    return NextResponse.json(
      { error: 'Failed to create clue' },
      { status: 500 }
    );
  }
}

// GET /api/admin/clues?sceneId=xxx - Get clues for a scene
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sceneId = searchParams.get('sceneId');

    if (!sceneId) {
      return NextResponse.json(
        { error: 'Scene ID is required' },
        { status: 400 }
      );
    }

    const clues = await prisma.clue.findMany({
      where: { sceneId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ clues });
  } catch (error) {
    console.error('Error fetching clues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clues' },
      { status: 500 }
    );
  }
}
