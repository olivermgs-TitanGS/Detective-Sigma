import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/cases/[caseId] - Get case details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        scenes: {
          include: {
            clues: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        puzzles: true,
        suspects: true,
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
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const body = await request.json();

    const updatedCase = await prisma.case.update({
      where: { id: caseId },
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
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    await prisma.case.delete({
      where: { id: caseId },
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
