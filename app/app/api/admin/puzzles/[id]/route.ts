import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/puzzles/[id] - Get single puzzle
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const puzzle = await prisma.puzzle.findUnique({
      where: { id: params.id },
    });

    if (!puzzle) {
      return NextResponse.json(
        { error: 'Puzzle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ puzzle });
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch puzzle' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/puzzles/[id] - Update puzzle
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const puzzle = await prisma.puzzle.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ puzzle });
  } catch (error) {
    console.error('Error updating puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to update puzzle' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/puzzles/[id] - Delete puzzle
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.puzzle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Puzzle deleted successfully' });
  } catch (error) {
    console.error('Error deleting puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to delete puzzle' },
      { status: 500 }
    );
  }
}
