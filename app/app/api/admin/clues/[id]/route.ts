import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/clues/[id] - Get single clue
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clue = await prisma.clue.findUnique({
      where: { id: params.id },
    });

    if (!clue) {
      return NextResponse.json(
        { error: 'Clue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ clue });
  } catch (error) {
    console.error('Error fetching clue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clue' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/clues/[id] - Update clue
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const clue = await prisma.clue.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ clue });
  } catch (error) {
    console.error('Error updating clue:', error);
    return NextResponse.json(
      { error: 'Failed to update clue' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/clues/[id] - Delete clue
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.clue.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Clue deleted successfully' });
  } catch (error) {
    console.error('Error deleting clue:', error);
    return NextResponse.json(
      { error: 'Failed to delete clue' },
      { status: 500 }
    );
  }
}
