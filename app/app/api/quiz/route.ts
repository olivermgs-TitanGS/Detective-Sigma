import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/quiz?caseId=xxx - Get quiz for a case
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');

    if (!caseId) {
      return NextResponse.json(
        { error: 'caseId is required' },
        { status: 400 }
      );
    }

    // Get the case with its puzzles to build quiz questions
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
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

    // Build quiz questions from puzzles and add a "whodunit" question
    const questions = [
      ...caseData.puzzles.map((puzzle, index) => {
        // Parse options from JSON if stored, otherwise generate fallback options
        let options: string[];
        if (puzzle.options && Array.isArray(puzzle.options)) {
          options = puzzle.options as string[];
        } else if (puzzle.options && typeof puzzle.options === 'string') {
          try {
            options = JSON.parse(puzzle.options);
          } catch {
            options = generateOptions(puzzle.correctAnswer, caseData.suspects.map(s => s.name));
          }
        } else {
          options = generateOptions(puzzle.correctAnswer, caseData.suspects.map(s => s.name));
        }

        return {
          id: puzzle.id,
          question: puzzle.questionText,
          options,
          correctAnswer: puzzle.correctAnswer,
          points: puzzle.points,
          type: 'puzzle',
          // Include narrative context for story-driven feedback
          narrativeContext: puzzle.narrativeContext,
          investigationPhase: puzzle.investigationPhase,
        };
      }),
      // Add the final "whodunit" question
      {
        id: 'whodunit',
        question: 'Based on all the evidence, who is responsible?',
        options: caseData.suspects.map(s => s.name),
        correctAnswer: caseData.suspects.find(s => s.isCulprit)?.name || '',
        points: 20,
        type: 'culprit',
      },
    ];

    return NextResponse.json({
      quiz: {
        caseId: caseData.id,
        caseTitle: caseData.title,
        questions,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

// POST /api/quiz - Submit quiz answers
export async function POST(request: Request) {
  try {
    const session = await auth();

    console.log('[Quiz Submit] Session:', session?.user?.id ? `User ${session.user.id}` : 'NO SESSION');

    if (!session?.user?.id) {
      console.log('[Quiz Submit] FAILED: No authenticated user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { caseId, answers } = body;

    console.log('[Quiz Submit] CaseId:', caseId, 'Answers:', Object.keys(answers || {}).length);

    if (!caseId || !answers) {
      return NextResponse.json(
        { error: 'caseId and answers are required' },
        { status: 400 }
      );
    }

    // Get the case data to calculate score
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
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

    // Build correct answers map
    const correctAnswers: Record<string, { answer: string; points: number }> = {};
    caseData.puzzles.forEach(puzzle => {
      correctAnswers[puzzle.id] = {
        answer: puzzle.correctAnswer,
        points: puzzle.points,
      };
    });
    const culprit = caseData.suspects.find(s => s.isCulprit);
    correctAnswers['whodunit'] = {
      answer: culprit?.name || '',
      points: 20,
    };

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const results: Record<string, boolean> = {};

    Object.entries(correctAnswers).forEach(([questionId, { answer, points }]) => {
      maxScore += points;
      const userAnswer = answers[questionId];
      const isCorrect = userAnswer === answer;
      results[questionId] = isCorrect;
      if (isCorrect) {
        score += points;
      }
    });

    const percentageScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    // Update progress to SOLVED
    const now = new Date();
    const updatedProgress = await prisma.progress.upsert({
      where: {
        userId_caseId: {
          userId: session.user.id,
          caseId: caseId,
        },
      },
      update: {
        status: 'SOLVED',
        score: score,
        completedAt: now,
      },
      create: {
        userId: session.user.id,
        caseId: caseId,
        status: 'SOLVED',
        score: score,
        startedAt: now,
        completedAt: now,
      },
    });

    console.log('[Quiz Submit] SUCCESS - Progress saved:', {
      progressId: updatedProgress.id,
      userId: session.user.id,
      caseId: caseId,
      status: updatedProgress.status,
      score: updatedProgress.score,
    });

    // Determine feedback based on score
    const feedback = generateFeedback(percentageScore, results, caseData);

    return NextResponse.json({
      submission: {
        score,
        maxScore,
        percentageScore,
        results,
        feedback,
        caseTitle: caseData.title,
      },
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}

function generateOptions(correctAnswer: string, suspectNames: string[] = []): string[] {
  // For numeric/money answers, generate plausible alternatives
  const numMatch = correctAnswer.match(/\$?([\d,]+\.?\d*)/);
  if (numMatch) {
    const num = parseFloat(numMatch[1].replace(',', ''));
    if (!isNaN(num)) {
      const prefix = correctAnswer.startsWith('$') ? '$' : '';
      return [
        `${prefix}${Math.round(num * 0.85).toLocaleString()}`,
        `${prefix}${Math.round(num * 1.15).toLocaleString()}`,
        correctAnswer,
        `${prefix}${Math.round(num * 0.5).toLocaleString()}`,
      ].sort(() => Math.random() - 0.5);
    }
  }

  // For percentage answers
  const percentMatch = correctAnswer.match(/(\d+)%/);
  if (percentMatch) {
    const pct = parseInt(percentMatch[1]);
    return [
      `${pct}%`,
      `${Math.max(5, pct - 15)}%`,
      `${Math.min(95, pct + 15)}%`,
      `${Math.max(10, pct - 25)}%`,
    ].sort(() => Math.random() - 0.5);
  }

  // For yes/no type answers
  if (correctAnswer.toLowerCase().includes('yes') || correctAnswer.toLowerCase().includes('no')) {
    return [
      correctAnswer,
      correctAnswer.toLowerCase().includes('yes') ? correctAnswer.replace(/yes/i, 'No') : correctAnswer.replace(/no/i, 'Yes'),
      'Insufficient evidence to determine',
      'More investigation needed',
    ].sort(() => Math.random() - 0.5);
  }

  // For suspect-related answers, use other suspect names
  if (suspectNames.length >= 4) {
    const otherNames = suspectNames.filter(n => !correctAnswer.includes(n));
    if (otherNames.length >= 3) {
      return [
        correctAnswer,
        ...otherNames.slice(0, 3),
      ].sort(() => Math.random() - 0.5);
    }
  }

  // Fallback: Return correct answer with generic alternatives
  return [
    correctAnswer,
    'None of the above',
    'Insufficient data',
    'Cannot be determined',
  ].sort(() => Math.random() - 0.5);
}

function generateFeedback(
  percentageScore: number,
  results: Record<string, boolean>,
  caseData: any
) {
  const correctCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  const gotCulprit = results['whodunit'];

  let message = '';
  let summary = '';
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (percentageScore >= 90) {
    message = 'Outstanding work, Detective!';
    summary = `You demonstrated exceptional investigative skills and correctly identified ${gotCulprit ? 'the culprit' : 'most of the key evidence'}.`;
  } else if (percentageScore >= 80) {
    message = 'Excellent work, Detective!';
    summary = `You showed strong analytical abilities throughout this investigation.`;
  } else if (percentageScore >= 70) {
    message = 'Good job, Detective!';
    summary = `You successfully completed the case with solid detective work.`;
  } else if (percentageScore >= 60) {
    message = 'Case closed, Detective.';
    summary = `You completed the investigation, but there's room for improvement.`;
  } else {
    message = 'Keep practicing, Detective.';
    summary = `This case was challenging. Review the evidence and try again!`;
  }

  // Generate specific feedback
  if (gotCulprit) {
    strengths.push('Correctly identified the responsible party');
  } else {
    improvements.push('Review all suspect alibis and evidence connections');
  }

  if (correctCount >= totalCount * 0.8) {
    strengths.push('Strong analytical and mathematical reasoning');
  }

  if (correctCount < totalCount * 0.6) {
    improvements.push('Practice mathematical word problems');
  }

  return {
    message,
    summary,
    strengths: strengths.length > 0 ? strengths : ['Completed the investigation'],
    improvements: improvements.length > 0 ? improvements : ['Keep up the great work!'],
  };
}
