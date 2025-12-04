import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/suspects - Create new suspect
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, name, role, imageUrl, bio, isCulprit, dialogueTree } = body;

    if (!caseId || !name) {
      return NextResponse.json(
        { error: 'Case ID and name are required' },
        { status: 400 }
      );
    }

    const suspect = await prisma.suspect.create({
      data: {
        caseId,
        name,
        role: role || null,
        imageUrl: imageUrl || null,
        bio: bio || null,
        isCulprit: isCulprit ?? false,
        dialogueTree: dialogueTree || null,
      },
    });

    return NextResponse.json({ suspect });
  } catch (error) {
    console.error('Error creating suspect:', error);
    return NextResponse.json(
      { error: 'Failed to create suspect' },
      { status: 500 }
    );
  }
}

// GET /api/admin/suspects?caseId=xxx - Get suspects for a case
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

    const suspects = await prisma.suspect.findMany({
      where: { caseId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ suspects });
  } catch (error) {
    console.error('Error fetching suspects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suspects' },
      { status: 500 }
    );
  }
}
