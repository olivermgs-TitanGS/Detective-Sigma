import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveGeneratedCase } from '@/lib/case-generator/generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.case) {
      return NextResponse.json(
        { error: 'No case data provided' },
        { status: 400 }
      );
    }

    // Save to database
    const caseId = await saveGeneratedCase(body.case, prisma);

    return NextResponse.json({ caseId, message: 'Case saved successfully' });
  } catch (error) {
    console.error('Error saving case:', error);
    return NextResponse.json(
      { error: 'Failed to save case', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
