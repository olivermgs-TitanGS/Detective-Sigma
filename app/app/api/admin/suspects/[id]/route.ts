import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/suspects/[id] - Get single suspect
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const suspect = await prisma.suspect.findUnique({
      where: { id: params.id },
    });

    if (!suspect) {
      return NextResponse.json(
        { error: 'Suspect not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ suspect });
  } catch (error) {
    console.error('Error fetching suspect:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suspect' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/suspects/[id] - Update suspect
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const suspect = await prisma.suspect.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ suspect });
  } catch (error) {
    console.error('Error updating suspect:', error);
    return NextResponse.json(
      { error: 'Failed to update suspect' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/suspects/[id] - Delete suspect
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.suspect.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Suspect deleted successfully' });
  } catch (error) {
    console.error('Error deleting suspect:', error);
    return NextResponse.json(
      { error: 'Failed to delete suspect' },
      { status: 500 }
    );
  }
}
