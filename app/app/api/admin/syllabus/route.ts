import { NextResponse } from 'next/server';
import { getSyllabusTracker } from '@/lib/case-generator/syllabus-tracker';
import { fullSyllabus, getSyllabusStats, getTopicsByGrade } from '@/lib/case-generator/syllabus';
import { prisma } from '@/lib/prisma';

// GET /api/admin/syllabus - Get syllabus coverage report
export async function GET() {
  try {
    const tracker = getSyllabusTracker();

    // Get cases from database to update tracker
    const cases = await prisma.case.findMany({
      select: {
        id: true,
        subjectFocus: true,
        difficulty: true,
        description: true,
        puzzles: {
          select: {
            type: true,
            questionText: true,
          },
        },
      },
    });

    // Analyze cases for topic coverage (simplified - in production, store topic IDs with cases)
    // For now, we'll estimate coverage based on puzzle types and difficulty

    const report = tracker.generateCoverageReport();
    const stats = getSyllabusStats();

    // Get topic list with coverage info
    const topicList = fullSyllabus.map(topic => {
      const usage = tracker.getTopicUsage(topic.id);
      return {
        id: topic.id,
        name: topic.name,
        subject: topic.subject,
        gradeLevel: topic.gradeLevel,
        strand: topic.strand,
        unit: topic.unit,
        usageCount: usage?.usageCount || 0,
        lastUsed: usage?.lastUsed || null,
        puzzleTypes: topic.puzzleTypes,
        keyVocabulary: topic.keyVocabulary.slice(0, 5),
      };
    });

    return NextResponse.json({
      stats,
      report: {
        totalTopics: report.totalTopics,
        coveredTopics: report.coveredTopics,
        coveragePercentage: report.coveragePercentage,
        recommendations: report.recommendations,
        byGrade: {
          P4: report.byGrade.P4 ? {
            total: report.byGrade.P4.total,
            covered: report.byGrade.P4.covered,
            percentage: report.byGrade.P4.percentage,
          } : null,
          P5: report.byGrade.P5 ? {
            total: report.byGrade.P5.total,
            covered: report.byGrade.P5.covered,
            percentage: report.byGrade.P5.percentage,
          } : null,
          P6: report.byGrade.P6 ? {
            total: report.byGrade.P6.total,
            covered: report.byGrade.P6.covered,
            percentage: report.byGrade.P6.percentage,
          } : null,
        },
        bySubject: report.bySubject,
        byStrand: report.byStrand,
      },
      topics: topicList,
      casesCount: cases.length,
    });
  } catch (error) {
    console.error('Error getting syllabus report:', error);
    return NextResponse.json(
      { error: 'Failed to get syllabus report' },
      { status: 500 }
    );
  }
}

// POST /api/admin/syllabus/record - Record topic usage
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topicIds, caseId } = body;

    if (!topicIds || !Array.isArray(topicIds) || !caseId) {
      return NextResponse.json(
        { error: 'topicIds (array) and caseId are required' },
        { status: 400 }
      );
    }

    const tracker = getSyllabusTracker();
    tracker.recordCaseTopics(topicIds, caseId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording topic usage:', error);
    return NextResponse.json(
      { error: 'Failed to record topic usage' },
      { status: 500 }
    );
  }
}
