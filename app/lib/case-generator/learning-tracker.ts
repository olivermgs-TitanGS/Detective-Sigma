/**
 * LEARNING PROGRESSION TRACKER
 *
 * Tracks student progress through the syllabus and recommends
 * which topics to cover next based on:
 * - Prerequisites completed
 * - Topics not yet covered
 * - Grade level appropriateness
 * - Learning objectives mastery
 */

import {
  SyllabusTopic,
  GradeLevel,
  Subject,
  fullSyllabus,
  getTopicById,
  getTopicsByGrade,
  getTopicsBySubject,
  getPrerequisiteTopics,
  curriculumStrands,
} from './syllabus';

// ============================================
// TYPES
// ============================================

export interface TopicProgress {
  topicId: string;
  exposure: number;        // Number of times encountered (0-5)
  correctAttempts: number; // Correct puzzle answers
  totalAttempts: number;   // Total puzzle attempts
  masteryLevel: 'not_started' | 'introduced' | 'practicing' | 'proficient' | 'mastered';
  lastAttemptDate?: Date;
  objectivesProgress: Record<string, 'not_started' | 'attempted' | 'achieved'>;
}

export interface StudentSyllabusProgress {
  studentId: string;
  gradeLevel: GradeLevel;
  topicProgress: Record<string, TopicProgress>;
  currentFocusTopics: string[];    // Topics currently being worked on
  completedTopics: string[];       // Mastered topics
  recommendedTopics: string[];     // Next topics to learn
  overallProgress: {
    mathPercent: number;
    sciencePercent: number;
    totalPercent: number;
  };
}

export interface CurriculumCoverage {
  totalTopics: number;
  coveredTopics: number;
  masteredTopics: number;
  byStrand: Record<string, {
    total: number;
    covered: number;
    mastered: number;
  }>;
  byGrade: Record<GradeLevel, {
    total: number;
    covered: number;
    mastered: number;
  }>;
}

export interface TopicRecommendation {
  topicId: string;
  topic: SyllabusTopic;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  prerequisitesMet: boolean;
}

// ============================================
// PROGRESS CALCULATION
// ============================================

/**
 * Calculate mastery level based on attempts and accuracy
 */
function calculateMasteryLevel(
  exposure: number,
  correctAttempts: number,
  totalAttempts: number
): TopicProgress['masteryLevel'] {
  if (exposure === 0) return 'not_started';
  if (exposure === 1) return 'introduced';

  const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;

  if (accuracy >= 0.9 && totalAttempts >= 5) return 'mastered';
  if (accuracy >= 0.75 && totalAttempts >= 3) return 'proficient';
  if (totalAttempts >= 1) return 'practicing';
  return 'introduced';
}

/**
 * Initialize progress for a topic
 */
export function initializeTopicProgress(topicId: string): TopicProgress {
  const topic = getTopicById(topicId);
  const objectivesProgress: Record<string, 'not_started' | 'attempted' | 'achieved'> = {};

  if (topic) {
    topic.learningObjectives.forEach(obj => {
      objectivesProgress[obj.id] = 'not_started';
    });
  }

  return {
    topicId,
    exposure: 0,
    correctAttempts: 0,
    totalAttempts: 0,
    masteryLevel: 'not_started',
    objectivesProgress,
  };
}

/**
 * Update progress after completing a puzzle
 */
export function updateTopicProgress(
  current: TopicProgress,
  wasCorrect: boolean,
  objectivesCovered: string[]
): TopicProgress {
  const newProgress = { ...current };
  newProgress.exposure += 1;
  newProgress.totalAttempts += 1;
  if (wasCorrect) {
    newProgress.correctAttempts += 1;
  }
  newProgress.lastAttemptDate = new Date();

  // Update objectives
  objectivesCovered.forEach(objId => {
    if (wasCorrect) {
      newProgress.objectivesProgress[objId] = 'achieved';
    } else if (newProgress.objectivesProgress[objId] === 'not_started') {
      newProgress.objectivesProgress[objId] = 'attempted';
    }
  });

  // Recalculate mastery
  newProgress.masteryLevel = calculateMasteryLevel(
    newProgress.exposure,
    newProgress.correctAttempts,
    newProgress.totalAttempts
  );

  return newProgress;
}

// ============================================
// PREREQUISITE CHECKING
// ============================================

/**
 * Check if prerequisites for a topic are met
 */
export function arePrerequisitesMet(
  topicId: string,
  studentProgress: Record<string, TopicProgress>
): boolean {
  const prereqs = getPrerequisiteTopics(topicId);

  // No prerequisites = met
  if (prereqs.length === 0) return true;

  // Check each prerequisite has at least 'practicing' level
  return prereqs.every(prereq => {
    const progress = studentProgress[prereq.id];
    if (!progress) return false;
    return ['practicing', 'proficient', 'mastered'].includes(progress.masteryLevel);
  });
}

/**
 * Get missing prerequisites for a topic
 */
export function getMissingPrerequisites(
  topicId: string,
  studentProgress: Record<string, TopicProgress>
): SyllabusTopic[] {
  const prereqs = getPrerequisiteTopics(topicId);

  return prereqs.filter(prereq => {
    const progress = studentProgress[prereq.id];
    if (!progress) return true;
    return !['practicing', 'proficient', 'mastered'].includes(progress.masteryLevel);
  });
}

// ============================================
// TOPIC RECOMMENDATIONS
// ============================================

/**
 * Get recommended topics for a student
 */
export function getRecommendedTopics(
  gradeLevel: GradeLevel,
  subject: Subject | 'ALL',
  studentProgress: Record<string, TopicProgress>,
  limit: number = 5
): TopicRecommendation[] {
  const recommendations: TopicRecommendation[] = [];

  // Get appropriate topics
  let eligibleTopics = fullSyllabus.filter(t => {
    // Grade level filter
    const gradeOrder = ['P4', 'P5', 'P6', 'SECONDARY', 'ADULT'];
    const studentGradeIndex = gradeOrder.indexOf(gradeLevel);
    const topicGradeIndex = gradeOrder.indexOf(t.gradeLevel);

    // Can do current grade or one below
    if (topicGradeIndex > studentGradeIndex) return false;
    if (topicGradeIndex < studentGradeIndex - 1) return false;

    // Subject filter
    if (subject !== 'ALL' && t.subject !== subject) return false;

    return true;
  });

  // Score and sort topics
  eligibleTopics.forEach(topic => {
    const progress = studentProgress[topic.id];
    const prereqsMet = arePrerequisitesMet(topic.id, studentProgress);

    // Determine priority and reason
    let priority: 'high' | 'medium' | 'low';
    let reason: string;

    if (!progress || progress.masteryLevel === 'not_started') {
      if (prereqsMet) {
        priority = 'high';
        reason = 'New topic ready to learn';
      } else {
        priority = 'low';
        reason = 'Prerequisites not yet complete';
      }
    } else if (progress.masteryLevel === 'introduced' || progress.masteryLevel === 'practicing') {
      priority = 'high';
      reason = 'Continue practicing for mastery';
    } else if (progress.masteryLevel === 'proficient') {
      priority = 'medium';
      reason = 'Almost mastered - one more practice';
    } else {
      priority = 'low';
      reason = 'Already mastered';
    }

    recommendations.push({
      topicId: topic.id,
      topic,
      reason,
      priority,
      prerequisitesMet: prereqsMet,
    });
  });

  // Sort: high priority first, then prerequisites met
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    if (a.prerequisitesMet && !b.prerequisitesMet) return -1;
    if (!a.prerequisitesMet && b.prerequisitesMet) return 1;
    return 0;
  });

  return recommendations.slice(0, limit);
}

/**
 * Get topics that need review (haven't been practiced recently)
 */
export function getTopicsNeedingReview(
  studentProgress: Record<string, TopicProgress>,
  daysSinceLastAttempt: number = 14
): TopicRecommendation[] {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - daysSinceLastAttempt * 24 * 60 * 60 * 1000);

  const reviewNeeded: TopicRecommendation[] = [];

  Object.entries(studentProgress).forEach(([topicId, progress]) => {
    if (progress.masteryLevel === 'not_started') return;
    if (progress.masteryLevel === 'mastered') return; // Mastered topics don't need immediate review

    if (progress.lastAttemptDate && new Date(progress.lastAttemptDate) < cutoffDate) {
      const topic = getTopicById(topicId);
      if (topic) {
        reviewNeeded.push({
          topicId,
          topic,
          reason: 'Needs review - not practiced recently',
          priority: 'medium',
          prerequisitesMet: true,
        });
      }
    }
  });

  return reviewNeeded;
}

// ============================================
// CURRICULUM COVERAGE
// ============================================

/**
 * Calculate overall curriculum coverage for a student
 */
export function calculateCurriculumCoverage(
  gradeLevel: GradeLevel,
  studentProgress: Record<string, TopicProgress>
): CurriculumCoverage {
  const gradeOrder = ['P4', 'P5', 'P6', 'SECONDARY', 'ADULT'];
  const studentGradeIndex = gradeOrder.indexOf(gradeLevel);

  // Include current grade and all previous grades
  const relevantGrades = gradeOrder.slice(0, studentGradeIndex + 1) as GradeLevel[];
  const relevantTopics = fullSyllabus.filter(t => relevantGrades.includes(t.gradeLevel));

  const coverage: CurriculumCoverage = {
    totalTopics: relevantTopics.length,
    coveredTopics: 0,
    masteredTopics: 0,
    byStrand: {},
    byGrade: {} as Record<GradeLevel, { total: number; covered: number; mastered: number }>,
  };

  // Initialize by grade
  relevantGrades.forEach(g => {
    coverage.byGrade[g] = { total: 0, covered: 0, mastered: 0 };
  });

  // Calculate coverage
  relevantTopics.forEach(topic => {
    const progress = studentProgress[topic.id];

    // By grade
    coverage.byGrade[topic.gradeLevel].total += 1;

    // By strand
    if (!coverage.byStrand[topic.strand]) {
      coverage.byStrand[topic.strand] = { total: 0, covered: 0, mastered: 0 };
    }
    coverage.byStrand[topic.strand].total += 1;

    // Check if covered/mastered
    if (progress && progress.masteryLevel !== 'not_started') {
      coverage.coveredTopics += 1;
      coverage.byGrade[topic.gradeLevel].covered += 1;
      coverage.byStrand[topic.strand].covered += 1;

      if (progress.masteryLevel === 'mastered') {
        coverage.masteredTopics += 1;
        coverage.byGrade[topic.gradeLevel].mastered += 1;
        coverage.byStrand[topic.strand].mastered += 1;
      }
    }
  });

  return coverage;
}

/**
 * Calculate percentage progress
 */
export function calculateProgressPercentages(
  gradeLevel: GradeLevel,
  studentProgress: Record<string, TopicProgress>
): { mathPercent: number; sciencePercent: number; totalPercent: number } {
  const coverage = calculateCurriculumCoverage(gradeLevel, studentProgress);

  const mathTopics = fullSyllabus.filter(t => t.subject === 'MATH');
  const scienceTopics = fullSyllabus.filter(t => t.subject === 'SCIENCE');

  let mathCovered = 0;
  let scienceCovered = 0;

  mathTopics.forEach(t => {
    const progress = studentProgress[t.id];
    if (progress && progress.masteryLevel !== 'not_started') mathCovered++;
  });

  scienceTopics.forEach(t => {
    const progress = studentProgress[t.id];
    if (progress && progress.masteryLevel !== 'not_started') scienceCovered++;
  });

  return {
    mathPercent: mathTopics.length > 0 ? Math.round((mathCovered / mathTopics.length) * 100) : 0,
    sciencePercent: scienceTopics.length > 0 ? Math.round((scienceCovered / scienceTopics.length) * 100) : 0,
    totalPercent: coverage.totalTopics > 0 ? Math.round((coverage.coveredTopics / coverage.totalTopics) * 100) : 0,
  };
}

// ============================================
// CASE GENERATION HELPERS
// ============================================

/**
 * Select topics for a new case based on student progress
 */
export function selectTopicsForCase(
  gradeLevel: GradeLevel,
  subject: Subject,
  studentProgress: Record<string, TopicProgress>,
  puzzleCount: number = 3
): string[] {
  const recommendations = getRecommendedTopics(gradeLevel, subject, studentProgress, puzzleCount * 2);

  // Prioritize:
  // 1. Topics with high priority and prerequisites met
  // 2. Mix of new and review topics
  const selectedTopics: string[] = [];

  // First, add high priority topics
  const highPriority = recommendations.filter(r => r.priority === 'high' && r.prerequisitesMet);
  for (const rec of highPriority) {
    if (selectedTopics.length >= puzzleCount) break;
    selectedTopics.push(rec.topicId);
  }

  // Then add medium priority if needed
  const mediumPriority = recommendations.filter(r => r.priority === 'medium' && r.prerequisitesMet);
  for (const rec of mediumPriority) {
    if (selectedTopics.length >= puzzleCount) break;
    if (!selectedTopics.includes(rec.topicId)) {
      selectedTopics.push(rec.topicId);
    }
  }

  // If still not enough, add any with prerequisites met
  for (const rec of recommendations) {
    if (selectedTopics.length >= puzzleCount) break;
    if (!selectedTopics.includes(rec.topicId) && rec.prerequisitesMet) {
      selectedTopics.push(rec.topicId);
    }
  }

  return selectedTopics;
}

/**
 * Get a learning path from current level to target topic
 */
export function getLearningPath(
  targetTopicId: string,
  studentProgress: Record<string, TopicProgress>
): SyllabusTopic[] {
  const path: SyllabusTopic[] = [];
  const target = getTopicById(targetTopicId);
  if (!target) return path;

  // Build dependency tree
  function addWithPrereqs(topicId: string, visited: Set<string>) {
    if (visited.has(topicId)) return;
    visited.add(topicId);

    const prereqs = getPrerequisiteTopics(topicId);
    prereqs.forEach(prereq => addWithPrereqs(prereq.id, visited));

    const topic = getTopicById(topicId);
    if (topic) path.push(topic);
  }

  addWithPrereqs(targetTopicId, new Set());

  // Filter out mastered topics
  return path.filter(topic => {
    const progress = studentProgress[topic.id];
    return !progress || progress.masteryLevel !== 'mastered';
  });
}

// ============================================
// CURRICULUM SUMMARY
// ============================================

/**
 * Get a summary of the complete curriculum
 */
export function getCurriculumSummary() {
  const summary = {
    totalTopics: fullSyllabus.length,
    strands: curriculumStrands.map(strand => ({
      ...strand,
      topicCount: fullSyllabus.filter(t => t.strand === strand.id).length,
    })),
    bySubject: {
      MATH: fullSyllabus.filter(t => t.subject === 'MATH').length,
      SCIENCE: fullSyllabus.filter(t => t.subject === 'SCIENCE').length,
    },
    byGrade: {
      P4: fullSyllabus.filter(t => t.gradeLevel === 'P4').length,
      P5: fullSyllabus.filter(t => t.gradeLevel === 'P5').length,
      P6: fullSyllabus.filter(t => t.gradeLevel === 'P6').length,
    },
    totalEstimatedLessons: fullSyllabus.reduce((sum, t) => sum + t.estimatedLessons, 0),
  };

  return summary;
}
