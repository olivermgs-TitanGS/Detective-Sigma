import { NextResponse } from 'next/server';
import { generateCase } from '@/lib/case-generator/generator';
import { generateIntelligentCase } from '@/lib/case-generator/intelligent-generator';
import { GenerationRequestSchema } from '@/lib/case-generator/types';
import { getSyllabusTracker, getRecommendedTopics } from '@/lib/case-generator/syllabus-tracker';

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

    const requestData = validationResult.data;

    // Use intelligent generator for better variety and syllabus coverage
    const useIntelligent = body.useIntelligent !== false; // Default to intelligent generator

    let generatedCase;
    if (useIntelligent) {
      generatedCase = await generateIntelligentCase(requestData);

      // Track syllabus coverage (topics used in this case)
      // The intelligent generator embeds topic info in the briefing
      // In a production system, we'd track this in the database
    } else {
      generatedCase = await generateCase(requestData);
    }

    // Get recommended topics for next generation (for UI display)
    const recommendedTopics = getRecommendedTopics(
      requestData.gradeLevel,
      requestData.subject,
      3
    );

    return NextResponse.json({
      case: generatedCase,
      recommendedTopics: recommendedTopics.map(t => ({
        id: t.id,
        name: t.name,
        strand: t.strand,
        gradeLevel: t.gradeLevel,
      })),
    });
  } catch (error) {
    console.error('Error generating case:', error);
    return NextResponse.json(
      { error: 'Failed to generate case', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
