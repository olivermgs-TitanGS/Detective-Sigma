import { NextResponse } from 'next/server';
import { caseGenerator } from '@/lib/case-generator/client';

// POST /api/cases/generate - Proxy to microservice
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Call microservice
    const job = await caseGenerator.generateCase({
      difficulty: body.difficulty,
      subject: body.subject,
      gradeLevel: body.gradeLevel,
      constraints: body.constraints,
      preferences: body.preferences,
    });

    return NextResponse.json(job, { status: 202 });
  } catch (error) {
    console.error('Error calling case generator:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate case' },
      { status: 500 }
    );
  }
}
