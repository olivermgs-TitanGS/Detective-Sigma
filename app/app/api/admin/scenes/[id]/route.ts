import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/scenes/[id] - Get single scene
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scene = await prisma.scene.findUnique({
      where: { id: params.id },
      include: { clues: true },
    });

    if (!scene) {
      return NextResponse.json(
        { error: 'Scene not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ scene });
  } catch (error) {
    console.error('Error fetching scene:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scene' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/scenes/[id] - Update scene
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const scene = await prisma.scene.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ scene });
  } catch (error) {
    console.error('Error updating scene:', error);
    return NextResponse.json(
      { error: 'Failed to update scene' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/scenes/[id] - Delete scene
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.scene.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Scene deleted successfully' });
  } catch (error) {
    console.error('Error deleting scene:', error);
    return NextResponse.json(
      { error: 'Failed to delete scene' },
      { status: 500 }
    );
  }
}
