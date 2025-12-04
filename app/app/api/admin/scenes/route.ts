import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/scenes - Create new scene
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, name, description, imageUrl, orderIndex, isInitialScene } = body;

    if (!caseId || !name) {
      return NextResponse.json(
        { error: 'Case ID and name are required' },
        { status: 400 }
      );
    }

    const scene = await prisma.scene.create({
      data: {
        caseId,
        name,
        description: description || '',
        imageUrl: imageUrl || '/images/scenes/default.png',
        orderIndex: orderIndex ?? 0,
        isInitialScene: isInitialScene ?? false,
      },
    });

    return NextResponse.json({ scene });
  } catch (error) {
    console.error('Error creating scene:', error);
    return NextResponse.json(
      { error: 'Failed to create scene' },
      { status: 500 }
    );
  }
}

// GET /api/admin/scenes?caseId=xxx - Get scenes for a case
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

    const scenes = await prisma.scene.findMany({
      where: { caseId },
      include: { clues: true },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ scenes });
  } catch (error) {
    console.error('Error fetching scenes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenes' },
      { status: 500 }
    );
  }
}
