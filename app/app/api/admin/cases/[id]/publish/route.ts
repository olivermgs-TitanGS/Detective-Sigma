import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get current case status
    const currentCase = await prisma.case.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!currentCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Toggle status
    const newStatus = currentCase.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';

    const updatedCase = await prisma.case.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      case: updatedCase,
      message: `Case ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`,
    });
  } catch (error) {
    console.error('Error updating case status:', error);
    return NextResponse.json(
      { error: 'Failed to update case status' },
      { status: 500 }
    );
  }
}
