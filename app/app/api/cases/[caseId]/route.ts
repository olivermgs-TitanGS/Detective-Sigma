import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/cases/[caseId] - Get case details
export async function GET(
  request: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const caseData = await prisma.case.findUnique({
      where: { id: params.caseId },
      include: {
        scenes: {
          include: {
            clues: true,
          },
          orderBy: { order: 'asc' },
        },
        puzzles: {
          orderBy: { order: 'asc' },
        },
        suspects: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ case: caseData });
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case' },
      { status: 500 }
    );
  }
}

// PATCH /api/cases/[caseId] - Update case (Admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const body = await request.json();

    const updatedCase = await prisma.case.update({
      where: { id: params.caseId },
      data: body,
    });

    return NextResponse.json({ case: updatedCase });
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[caseId] - Delete case (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    await prisma.case.delete({
      where: { id: params.caseId },
    });

    return NextResponse.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}
