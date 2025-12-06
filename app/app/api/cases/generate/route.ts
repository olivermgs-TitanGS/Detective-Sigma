import { NextResponse } from 'next/server';
import { generateCase } from '@/lib/case-generator/generator';
import { GenerationRequestSchema } from '@/lib/case-generator/types';

// POST /api/cases/generate - Generate case directly
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request
    const validationResult = GenerationRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Generate case directly
    const generatedCase = await generateCase(validationResult.data);

    return NextResponse.json({ case: generatedCase }, { status: 200 });
  } catch (error) {
    console.error('Error generating case:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate case' },
      { status: 500 }
    );
  }
}
