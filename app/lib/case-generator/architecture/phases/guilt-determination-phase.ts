/**
 * PHASE 3: GUILT DETERMINATION
 *
 * This is the CRITICAL phase that determines who is guilty based on
 * EVIDENCE INTERSECTION, not random selection.
 *
 * The culprit is determined by comparing:
 * - Suspect timelines vs crime timeline
 * - Opportunity (gaps in alibi during crime window)
 * - Motive strength
 * - Access to means
 * - Trace match (could they have left the evidence?)
 *
 * This ensures the story makes LOGICAL SENSE.
 */

import {
  IGenerationPhase,
  GenerationContext,
  ICulpritDetermination,
  ISuspectProfile,
  ICrimeBlueprint,
  TimeWindow,
  registry,
} from '../index';

// ============================================
// SCORING WEIGHTS
// ============================================

interface ScoringWeights {
  opportunity: number;
  motive: number;
  means: number;
  traceMatch: number;
}

const DIFFICULTY_WEIGHTS: Record<string, ScoringWeights> = {
  ROOKIE: {
    opportunity: 40,  // Most obvious factor
    motive: 30,       // Clear motive
    means: 20,        // Some consideration
    traceMatch: 10,   // Less emphasis
  },
  INSPECTOR: {
    opportunity: 35,
    motive: 30,
    means: 20,
    traceMatch: 15,
  },
  DETECTIVE: {
    opportunity: 30,
    motive: 25,
    means: 25,
    traceMatch: 20,
  },
  CHIEF: {
    opportunity: 25,
    motive: 25,
    means: 25,
    traceMatch: 25,  // Everything matters equally
  },
};

// ============================================
// PHASE IMPLEMENTATION
// ============================================

export class GuiltDeterminationPhase implements IGenerationPhase<void, ICulpritDetermination> {
  readonly name = 'guilt-determination';
  readonly order = 30;  // After suspect pool

  canExecute(context: GenerationContext): boolean {
    return !!context.crimeBlueprint && !!context.suspectPool && !context.culpritDetermination;
  }

  async execute(context: GenerationContext): Promise<ICulpritDetermination> {
    const blueprint = context.crimeBlueprint!;
    const suspects = context.suspectPool!;
    const { params } = context;

    // Get scoring weights for difficulty
    const weights = DIFFICULTY_WEIGHTS[params.difficulty] || DIFFICULTY_WEIGHTS.INSPECTOR;

    // Score each suspect
    const scores = suspects.map(suspect => ({
      suspect,
      scores: this.scoreSuspect(suspect, blueprint, weights),
    }));

    // Sort by total score (highest = most likely culprit)
    scores.sort((a, b) => b.scores.total - a.scores.total);

    // The highest scorer is the culprit
    const culprit = scores[0];

    // Mark the suspect as guilty in the pool
    const culpritInPool = suspects.find(s => s.id === culprit.suspect.id);
    if (culpritInPool) {
      (culpritInPool as { isGuilty?: boolean }).isGuilty = true;
    }

    // Generate proof points
    const proofPoints = this.generateProofPoints(culprit.suspect, blueprint);

    // Generate red herrings for other suspects
    const redHerrings = this.generateRedHerrings(
      suspects.filter(s => s.id !== culprit.suspect.id),
      blueprint,
      params.difficulty
    );

    const determination: ICulpritDetermination = {
      culpritId: culprit.suspect.id,
      culpritName: culprit.suspect.name,
      evidence: {
        opportunityScore: culprit.scores.opportunity,
        motiveScore: culprit.scores.motive,
        meansScore: culprit.scores.means,
        traceMatchScore: culprit.scores.traceMatch,
        totalScore: culprit.scores.total,
      },
      proofPoints,
      redHerrings,
    };

    // Store in context
    context.culpritDetermination = determination;

    return determination;
  }

  private scoreSuspect(
    suspect: ISuspectProfile,
    blueprint: ICrimeBlueprint,
    weights: ScoringWeights
  ): {
    opportunity: number;
    motive: number;
    means: number;
    traceMatch: number;
    total: number;
  } {
    const opportunity = this.scoreOpportunity(suspect, blueprint);
    const motive = this.scoreMotive(suspect);
    const means = this.scoreMeans(suspect, blueprint);
    const traceMatch = this.scoreTraceMatch(suspect, blueprint);

    // Apply weights and calculate total
    const weightedOpportunity = opportunity * (weights.opportunity / 100);
    const weightedMotive = motive * (weights.motive / 100);
    const weightedMeans = means * (weights.means / 100);
    const weightedTraceMatch = traceMatch * (weights.traceMatch / 100);

    const total = weightedOpportunity + weightedMotive + weightedMeans + weightedTraceMatch;

    return {
      opportunity: Math.round(opportunity),
      motive: Math.round(motive),
      means: Math.round(means),
      traceMatch: Math.round(traceMatch),
      total: Math.round(total),
    };
  }

  /**
   * Score opportunity based on timeline gaps and access
   */
  private scoreOpportunity(suspect: ISuspectProfile, blueprint: ICrimeBlueprint): number {
    let score = 0;
    const crimeWindow = blueprint.timeline.crimeWindow;

    // Check if suspect has access
    if (suspect.opportunity.hadAccess) {
      score += 30;
    }

    // Check for gaps in alibi during crime window
    if (suspect.opportunity.hasGap) {
      score += 40;

      // Check if gap overlaps with crime window
      if (suspect.opportunity.gapWindow) {
        const overlap = this.calculateOverlap(
          suspect.opportunity.gapWindow,
          crimeWindow
        );
        score += Math.min(30, overlap * 3);  // Up to 30 more points
      }
    }

    // Check verifiability of alibi
    const crimeTimeMovements = suspect.timeline.filter(m =>
      m.time.minutes >= crimeWindow.start.minutes &&
      m.time.minutes <= crimeWindow.end.minutes
    );

    const unverifiedCount = crimeTimeMovements.filter(m => !m.verifiable).length;
    const verifiedCount = crimeTimeMovements.filter(m => m.verifiable).length;

    if (unverifiedCount > verifiedCount) {
      score += 20;  // More unverified = more suspicious
    }

    return Math.min(100, score);
  }

  /**
   * Score motive based on strength and type
   */
  private scoreMotive(suspect: ISuspectProfile): number {
    let score = 0;

    switch (suspect.motive.strength) {
      case 'strong':
        score = 80;
        break;
      case 'moderate':
        score = 50;
        break;
      case 'weak':
        score = 25;
        break;
      default:
        score = 10;
    }

    // Bonus for certain motive types that fit crime types
    const strongMotiveTypes = ['financial', 'revenge', 'competition'];
    if (strongMotiveTypes.includes(suspect.motive.type)) {
      score += 15;
    }

    // Evidence of motive adds to score
    score += suspect.motive.evidence.length * 5;

    return Math.min(100, score);
  }

  /**
   * Score means/access based on role and privileges
   */
  private scoreMeans(suspect: ISuspectProfile, blueprint: ICrimeBlueprint): number {
    let score = 0;

    // Role-based access scoring
    const accessScores: Record<string, number> = {
      management: 80,
      key_holder: 60,
      staff: 40,
      public: 20,
    };

    // Infer access level from role and traits
    if (suspect.traits.some(t => t.includes('keys') || t.includes('access'))) {
      score += 60;
    } else if (suspect.traits.some(t => t.includes('restricted') || t.includes('alone'))) {
      score += 40;
    } else {
      score += 20;
    }

    // Check if they know the layout/routines
    if (suspect.traits.some(t => t.includes('knows') || t.includes('routine'))) {
      score += 20;
    }

    // Check if their role gives special knowledge
    if (suspect.role.toLowerCase().includes('manager') ||
        suspect.role.toLowerCase().includes('supervisor') ||
        suspect.role.toLowerCase().includes('head')) {
      score += 20;
    }

    return Math.min(100, score);
  }

  /**
   * Score trace match - could this suspect have left the evidence?
   */
  private scoreTraceMatch(suspect: ISuspectProfile, blueprint: ICrimeBlueprint): number {
    let score = 0;

    // Check if suspect's timeline puts them near trace locations
    for (const trace of blueprint.traces) {
      // Check if any suspect movement is near this trace's location
      const nearTrace = suspect.timeline.some(m =>
        m.location.toLowerCase().includes(trace.location.toLowerCase()) ||
        trace.location.toLowerCase().includes(m.location.toLowerCase())
      );

      if (nearTrace) {
        score += 10;
      }
    }

    // Check if suspect has gaps that could allow trace creation
    if (suspect.opportunity.hasGap) {
      score += 30;
    }

    // Check if traces match suspect's access patterns
    const physicalTraces = blueprint.traces.filter(t => t.type === 'physical').length;
    const digitalTraces = blueprint.traces.filter(t => t.type === 'digital').length;

    // Key holders leave more traces
    if (suspect.traits.some(t => t.includes('keys'))) {
      score += digitalTraces * 5;  // Access logs
    }

    // Physical presence = physical traces
    if (!suspect.alibi.verifiable) {
      score += physicalTraces * 3;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate overlap between two time windows in minutes
   */
  private calculateOverlap(window1: TimeWindow, window2: TimeWindow): number {
    const overlapStart = Math.max(window1.start.minutes, window2.start.minutes);
    const overlapEnd = Math.min(window1.end.minutes, window2.end.minutes);
    return Math.max(0, overlapEnd - overlapStart);
  }

  /**
   * Generate proof points for the culprit
   */
  private generateProofPoints(
    culprit: ISuspectProfile,
    blueprint: ICrimeBlueprint
  ): ICulpritDetermination['proofPoints'] {
    const proofPoints: ICulpritDetermination['proofPoints'] = [];

    // Opportunity proof
    if (culprit.opportunity.hasGap) {
      proofPoints.push({
        type: 'opportunity',
        description: `${culprit.name}'s alibi has an unverified gap during the crime window (${culprit.opportunity.gapWindow?.start.formatted || 'unknown'} - ${culprit.opportunity.gapWindow?.end.formatted || 'unknown'})`,
      });
    }

    if (culprit.opportunity.hadAccess) {
      proofPoints.push({
        type: 'opportunity',
        description: `${culprit.name} had access to the location through their role as ${culprit.role}`,
      });
    }

    // Motive proof
    proofPoints.push({
      type: 'motive',
      description: `${culprit.name} had a ${culprit.motive.strength} ${culprit.motive.type} motive: ${culprit.motive.description}`,
    });

    // Means proof
    if (culprit.traits.some(t => t.includes('keys') || t.includes('access'))) {
      proofPoints.push({
        type: 'means',
        description: `${culprit.name} had the means to commit the crime through their ${culprit.role} role`,
      });
    }

    // Trace proof - link to physical evidence
    const relevantTraces = blueprint.traces.filter(t =>
      t.type === 'physical' || t.type === 'digital'
    );

    if (relevantTraces.length > 0) {
      proofPoints.push({
        type: 'trace',
        description: `Physical evidence at the scene matches ${culprit.name}'s access pattern`,
        linkedTraceId: relevantTraces[0].id,
      });
    }

    return proofPoints;
  }

  /**
   * Generate red herrings for innocent suspects
   */
  private generateRedHerrings(
    innocentSuspects: ISuspectProfile[],
    blueprint: ICrimeBlueprint,
    difficulty: string
  ): ICulpritDetermination['redHerrings'] {
    const redHerrings: ICulpritDetermination['redHerrings'] = [];

    // Number of red herrings based on difficulty
    const maxHerings = difficulty === 'ROOKIE' ? 1 : difficulty === 'INSPECTOR' ? 2 : 3;

    // Sort suspects by how suspicious they appear
    const sortedByMotiveStrength = [...innocentSuspects].sort((a, b) => {
      const strengthOrder = { strong: 3, moderate: 2, weak: 1, none: 0 };
      return (strengthOrder[b.motive.strength as keyof typeof strengthOrder] || 0) -
             (strengthOrder[a.motive.strength as keyof typeof strengthOrder] || 0);
    });

    for (let i = 0; i < Math.min(maxHerings, sortedByMotiveStrength.length); i++) {
      const suspect = sortedByMotiveStrength[i];

      // Generate a misleading fact
      let misleadingFact: string;
      let actualExplanation: string;

      if (suspect.motive.strength === 'strong' || suspect.motive.strength === 'moderate') {
        misleadingFact = `${suspect.name} has a clear ${suspect.motive.type} motive: ${suspect.motive.description}`;
        actualExplanation = `Despite the motive, ${suspect.name}'s alibi was verified and they were not at the scene during the crime window`;
      } else if (!suspect.alibi.verifiable) {
        misleadingFact = `${suspect.name}'s alibi cannot be fully verified`;
        actualExplanation = `While unverified, ${suspect.name} lacked the means and access required to commit the crime`;
      } else if (suspect.opportunity.hadAccess) {
        misleadingFact = `${suspect.name} had access to the location`;
        actualExplanation = `${suspect.name}'s timeline shows they were elsewhere during the critical window, confirmed by witnesses`;
      } else {
        misleadingFact = `${suspect.name} was seen near the scene`;
        actualExplanation = `${suspect.name} was there for legitimate reasons and their movements are accounted for`;
      }

      redHerrings.push({
        suspectId: suspect.id,
        suspectName: suspect.name,
        misleadingFact,
        actualExplanation,
      });
    }

    return redHerrings;
  }
}

// Register this phase
export function registerGuiltDeterminationPhase(): void {
  registry.registerPhase(new GuiltDeterminationPhase());
}
