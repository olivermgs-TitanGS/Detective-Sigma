/**
 * SYLLABUS COVERAGE TRACKER
 *
 * Ensures balanced coverage of all P4-P6 syllabus topics by:
 * 1. Tracking which topics have been used in generated cases
 * 2. Prioritizing underused topics for new cases
 * 3. Providing coverage reports and gap analysis
 * 4. Guaranteeing no topic is left behind
 */

import {
  SyllabusTopic,
  fullSyllabus,
  allMathTopics,
  allScienceTopics,
  getTopicsByGrade,
  getTopicsBySubject,
  GradeLevel,
  Subject,
} from './syllabus';

// ============================================
// TYPES
// ============================================

export interface TopicUsage {
  topicId: string;
  usageCount: number;
  lastUsed: Date | null;
  casesUsedIn: string[];
}

export interface CoverageReport {
  totalTopics: number;
  coveredTopics: number;
  coveragePercentage: number;
  uncoveredTopics: SyllabusTopic[];
  underusedTopics: SyllabusTopic[];
  overusedTopics: SyllabusTopic[];
  byGrade: Record<GradeLevel, GradeCoverage>;
  bySubject: Record<Subject, SubjectCoverage>;
  byStrand: Record<string, StrandCoverage>;
  recommendations: string[];
}

export interface GradeCoverage {
  total: number;
  covered: number;
  percentage: number;
  topics: TopicCoverageDetail[];
}

export interface SubjectCoverage {
  total: number;
  covered: number;
  percentage: number;
}

export interface StrandCoverage {
  name: string;
  total: number;
  covered: number;
  percentage: number;
}

export interface TopicCoverageDetail {
  topic: SyllabusTopic;
  usageCount: number;
  lastUsed: Date | null;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ============================================
// COVERAGE TRACKER CLASS
// ============================================

export class SyllabusTracker {
  private usageMap: Map<string, TopicUsage>;
  private targetUsagePerTopic: number;

  constructor(targetUsage: number = 3) {
    this.usageMap = new Map();
    this.targetUsagePerTopic = targetUsage;

    // Initialize all topics with zero usage
    for (const topic of fullSyllabus) {
      this.usageMap.set(topic.id, {
        topicId: topic.id,
        usageCount: 0,
        lastUsed: null,
        casesUsedIn: [],
      });
    }
  }

  // ============================================
  // TRACKING METHODS
  // ============================================

  /**
   * Record that a topic was used in a case
   */
  recordTopicUsage(topicId: string, caseId: string): void {
    const usage = this.usageMap.get(topicId);
    if (usage) {
      usage.usageCount++;
      usage.lastUsed = new Date();
      if (!usage.casesUsedIn.includes(caseId)) {
        usage.casesUsedIn.push(caseId);
      }
    }
  }

  /**
   * Record multiple topics used in a case
   */
  recordCaseTopics(topicIds: string[], caseId: string): void {
    for (const topicId of topicIds) {
      this.recordTopicUsage(topicId, caseId);
    }
  }

  /**
   * Get usage stats for a topic
   */
  getTopicUsage(topicId: string): TopicUsage | undefined {
    return this.usageMap.get(topicId);
  }

  // ============================================
  // SELECTION METHODS (for balanced coverage)
  // ============================================

  /**
   * Get the next topics to use based on coverage needs
   * Prioritizes: Never used > Least used > Oldest used
   */
  getNextTopics(
    count: number,
    filters?: {
      gradeLevel?: GradeLevel;
      subject?: Subject;
      strand?: string;
    }
  ): SyllabusTopic[] {
    let candidates = [...fullSyllabus];

    // Apply filters
    if (filters?.gradeLevel) {
      candidates = candidates.filter(t => t.gradeLevel === filters.gradeLevel);
    }
    if (filters?.subject) {
      candidates = candidates.filter(t => t.subject === filters.subject);
    }
    if (filters?.strand) {
      candidates = candidates.filter(t => t.strand === filters.strand);
    }

    // Score and sort by priority
    const scored = candidates.map(topic => {
      const usage = this.usageMap.get(topic.id)!;
      let score = 0;

      // Never used topics get highest priority
      if (usage.usageCount === 0) {
        score += 1000;
      }

      // Fewer uses = higher score
      score += (this.targetUsagePerTopic - usage.usageCount) * 100;

      // Older last use = higher score
      if (usage.lastUsed) {
        const daysSinceUse = (Date.now() - usage.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
        score += daysSinceUse * 10;
      } else {
        score += 500; // Never used bonus
      }

      return { topic, score, usage };
    });

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // Return top N topics
    return scored.slice(0, count).map(s => s.topic);
  }

  /**
   * Get topics that MUST be used (never used or severely underused)
   */
  getMustUseTopics(gradeLevel?: GradeLevel): SyllabusTopic[] {
    let topics = fullSyllabus;
    if (gradeLevel) {
      topics = topics.filter(t => t.gradeLevel === gradeLevel);
    }

    return topics.filter(topic => {
      const usage = this.usageMap.get(topic.id)!;
      return usage.usageCount === 0;
    });
  }

  /**
   * Get a balanced set of topics covering multiple strands
   */
  getBalancedTopicSet(
    count: number,
    gradeLevel: GradeLevel,
    subject: Subject
  ): SyllabusTopic[] {
    const candidates = fullSyllabus.filter(
      t => t.gradeLevel === gradeLevel &&
           (subject === 'INTEGRATED' || t.subject === subject)
    );

    // Group by strand
    const strandGroups: Record<string, SyllabusTopic[]> = {};
    for (const topic of candidates) {
      if (!strandGroups[topic.strand]) {
        strandGroups[topic.strand] = [];
      }
      strandGroups[topic.strand].push(topic);
    }

    // Select from different strands
    const selected: SyllabusTopic[] = [];
    const strands = Object.keys(strandGroups);
    let strandIndex = 0;

    while (selected.length < count && strands.length > 0) {
      const strand = strands[strandIndex % strands.length];
      const strandTopics = strandGroups[strand];

      if (strandTopics.length > 0) {
        // Get the least used topic from this strand
        const sortedByUsage = strandTopics.sort((a, b) => {
          const usageA = this.usageMap.get(a.id)!.usageCount;
          const usageB = this.usageMap.get(b.id)!.usageCount;
          return usageA - usageB;
        });

        const topic = sortedByUsage[0];
        if (!selected.find(t => t.id === topic.id)) {
          selected.push(topic);
          // Remove the selected topic from the strand
          strandGroups[strand] = strandTopics.filter(t => t.id !== topic.id);
        }
      }

      strandIndex++;

      // Remove empty strands
      for (const s of strands) {
        if (strandGroups[s].length === 0) {
          const idx = strands.indexOf(s);
          if (idx !== -1) strands.splice(idx, 1);
        }
      }
    }

    return selected;
  }

  // ============================================
  // REPORTING METHODS
  // ============================================

  /**
   * Generate comprehensive coverage report
   */
  generateCoverageReport(): CoverageReport {
    const allUsage = Array.from(this.usageMap.values());
    const coveredTopics = allUsage.filter(u => u.usageCount > 0);
    const avgUsage = coveredTopics.length > 0
      ? coveredTopics.reduce((sum, u) => sum + u.usageCount, 0) / coveredTopics.length
      : 0;

    // Find problematic topics
    const uncoveredTopics = fullSyllabus.filter(t =>
      this.usageMap.get(t.id)!.usageCount === 0
    );

    const underusedTopics = fullSyllabus.filter(t => {
      const usage = this.usageMap.get(t.id)!;
      return usage.usageCount > 0 && usage.usageCount < avgUsage * 0.5;
    });

    const overusedTopics = fullSyllabus.filter(t => {
      const usage = this.usageMap.get(t.id)!;
      return usage.usageCount > avgUsage * 2;
    });

    // Coverage by grade
    const byGrade: Record<GradeLevel, GradeCoverage> = {} as any;
    for (const grade of ['P4', 'P5', 'P6'] as GradeLevel[]) {
      const gradeTopics = getTopicsByGrade(grade);
      const covered = gradeTopics.filter(t => this.usageMap.get(t.id)!.usageCount > 0);

      byGrade[grade] = {
        total: gradeTopics.length,
        covered: covered.length,
        percentage: Math.round((covered.length / gradeTopics.length) * 100),
        topics: gradeTopics.map(topic => {
          const usage = this.usageMap.get(topic.id)!;
          return {
            topic,
            usageCount: usage.usageCount,
            lastUsed: usage.lastUsed,
            priority: this.getTopicPriority(topic.id),
          };
        }),
      };
    }

    // Coverage by subject
    const bySubject: Record<Subject, SubjectCoverage> = {} as any;
    for (const subject of ['MATH', 'SCIENCE'] as Subject[]) {
      const subjectTopics = getTopicsBySubject(subject);
      const covered = subjectTopics.filter(t => this.usageMap.get(t.id)!.usageCount > 0);

      bySubject[subject] = {
        total: subjectTopics.length,
        covered: covered.length,
        percentage: Math.round((covered.length / subjectTopics.length) * 100),
      };
    }
    bySubject['INTEGRATED'] = {
      total: fullSyllabus.length,
      covered: coveredTopics.length,
      percentage: Math.round((coveredTopics.length / fullSyllabus.length) * 100),
    };

    // Coverage by strand
    const strands = [...new Set(fullSyllabus.map(t => t.strand))];
    const byStrand: Record<string, StrandCoverage> = {};
    for (const strand of strands) {
      const strandTopics = fullSyllabus.filter(t => t.strand === strand);
      const covered = strandTopics.filter(t => this.usageMap.get(t.id)!.usageCount > 0);

      byStrand[strand] = {
        name: strand,
        total: strandTopics.length,
        covered: covered.length,
        percentage: Math.round((covered.length / strandTopics.length) * 100),
      };
    }

    // Generate recommendations
    const recommendations: string[] = [];

    if (uncoveredTopics.length > 0) {
      recommendations.push(
        `${uncoveredTopics.length} topics have never been covered. Priority: ${uncoveredTopics.slice(0, 3).map(t => t.name).join(', ')}`
      );
    }

    for (const grade of ['P4', 'P5', 'P6'] as GradeLevel[]) {
      if (byGrade[grade].percentage < 50) {
        recommendations.push(
          `${grade} coverage is only ${byGrade[grade].percentage}%. Generate more ${grade} cases.`
        );
      }
    }

    for (const [strand, coverage] of Object.entries(byStrand)) {
      if (coverage.percentage < 30) {
        recommendations.push(
          `"${strand}" strand coverage is low (${coverage.percentage}%). Focus on this area.`
        );
      }
    }

    if (overusedTopics.length > 5) {
      recommendations.push(
        `${overusedTopics.length} topics are overused. Diversify topic selection.`
      );
    }

    return {
      totalTopics: fullSyllabus.length,
      coveredTopics: coveredTopics.length,
      coveragePercentage: Math.round((coveredTopics.length / fullSyllabus.length) * 100),
      uncoveredTopics,
      underusedTopics,
      overusedTopics,
      byGrade,
      bySubject,
      byStrand,
      recommendations,
    };
  }

  /**
   * Get priority level for a topic
   */
  private getTopicPriority(topicId: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    const usage = this.usageMap.get(topicId);
    if (!usage) return 'HIGH';

    if (usage.usageCount === 0) return 'HIGH';
    if (usage.usageCount < this.targetUsagePerTopic) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Get coverage gaps for a specific grade
   */
  getGradeCoverageGaps(gradeLevel: GradeLevel): {
    missingStrands: string[];
    missingTopics: SyllabusTopic[];
    weakAreas: string[];
  } {
    const gradeTopics = getTopicsByGrade(gradeLevel);
    const strands = [...new Set(gradeTopics.map(t => t.strand))];

    const missingTopics = gradeTopics.filter(t =>
      this.usageMap.get(t.id)!.usageCount === 0
    );

    const missingStrands = strands.filter(strand => {
      const strandTopics = gradeTopics.filter(t => t.strand === strand);
      return strandTopics.every(t => this.usageMap.get(t.id)!.usageCount === 0);
    });

    const strandCoverage = strands.map(strand => {
      const strandTopics = gradeTopics.filter(t => t.strand === strand);
      const covered = strandTopics.filter(t => this.usageMap.get(t.id)!.usageCount > 0);
      return {
        strand,
        coverage: covered.length / strandTopics.length,
      };
    });

    const weakAreas = strandCoverage
      .filter(s => s.coverage < 0.5 && s.coverage > 0)
      .map(s => s.strand);

    return { missingStrands, missingTopics, weakAreas };
  }

  // ============================================
  // PERSISTENCE METHODS
  // ============================================

  /**
   * Export usage data for persistence
   */
  exportUsageData(): Record<string, TopicUsage> {
    const data: Record<string, TopicUsage> = {};
    for (const [id, usage] of this.usageMap.entries()) {
      data[id] = { ...usage };
    }
    return data;
  }

  /**
   * Import usage data from persistence
   */
  importUsageData(data: Record<string, TopicUsage>): void {
    for (const [id, usage] of Object.entries(data)) {
      if (this.usageMap.has(id)) {
        this.usageMap.set(id, {
          ...usage,
          lastUsed: usage.lastUsed ? new Date(usage.lastUsed) : null,
        });
      }
    }
  }

  /**
   * Reset all tracking data
   */
  reset(): void {
    for (const usage of this.usageMap.values()) {
      usage.usageCount = 0;
      usage.lastUsed = null;
      usage.casesUsedIn = [];
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let trackerInstance: SyllabusTracker | null = null;

export function getSyllabusTracker(): SyllabusTracker {
  if (!trackerInstance) {
    trackerInstance = new SyllabusTracker();
  }
  return trackerInstance;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Ensure a case covers topics from the syllabus properly
 */
export function validateCaseCoverage(
  topicIds: string[],
  gradeLevel: GradeLevel
): {
  valid: boolean;
  issues: string[];
  suggestions: SyllabusTopic[];
} {
  const tracker = getSyllabusTracker();
  const issues: string[] = [];
  const suggestions: SyllabusTopic[] = [];

  // Check if topics exist and match grade level
  for (const topicId of topicIds) {
    const topic = fullSyllabus.find(t => t.id === topicId);
    if (!topic) {
      issues.push(`Topic ${topicId} not found in syllabus`);
    } else if (topic.gradeLevel !== gradeLevel && gradeLevel !== 'SECONDARY' && gradeLevel !== 'ADULT') {
      issues.push(`Topic "${topic.name}" is for ${topic.gradeLevel}, not ${gradeLevel}`);
    }
  }

  // Check for gaps
  const gaps = tracker.getGradeCoverageGaps(gradeLevel);
  if (gaps.missingStrands.length > 0) {
    issues.push(`Missing coverage for strands: ${gaps.missingStrands.join(', ')}`);

    // Suggest topics from missing strands
    for (const strand of gaps.missingStrands.slice(0, 2)) {
      const strandTopics = fullSyllabus.filter(
        t => t.strand === strand && t.gradeLevel === gradeLevel
      );
      if (strandTopics.length > 0) {
        suggestions.push(strandTopics[0]);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    suggestions,
  };
}

/**
 * Get recommended topics for next case generation
 */
export function getRecommendedTopics(
  gradeLevel: GradeLevel,
  subject: Subject,
  count: number = 3
): SyllabusTopic[] {
  const tracker = getSyllabusTracker();
  return tracker.getBalancedTopicSet(count, gradeLevel, subject);
}
