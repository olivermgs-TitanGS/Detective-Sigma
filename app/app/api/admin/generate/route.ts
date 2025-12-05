import { NextResponse } from 'next/server';
import { generateCase } from '@/lib/case-generator/generator';
import { GenerationRequestSchema } from '@/lib/case-generator/types';
import { getRecommendedTopics } from '@/lib/case-generator/syllabus-tracker';
import { GradeLevel as SyllabusGradeLevel } from '@/lib/case-generator/syllabus';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request
    const validationResult = GenerationRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const requestData = validationResult.data;

    // Use narrative-driven generator (scalable system)
    // This ensures coherent cases with matching briefing, story, suspects, and location
    const generatedCase = await generateCase(requestData);

    // Map grade level for syllabus (P1-P3 -> P4, P4-P6 stay same)
    const syllabusGradeMap: Record<string, SyllabusGradeLevel> = {
      P1: 'P4', P2: 'P4', P3: 'P4',
      P4: 'P4', P5: 'P5', P6: 'P6',
    };
    const syllabusGradeLevel = syllabusGradeMap[requestData.gradeLevel] || 'P4';

    // Get recommended topics for next generation (for UI display)
    const recommendedTopics = getRecommendedTopics(
      syllabusGradeLevel,
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
