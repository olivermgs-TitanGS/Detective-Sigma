/**
 * STORY PUZZLES SYSTEM
 *
 * Integrates puzzles directly into the narrative:
 * - Puzzles unlock evidence or story revelations
 * - Context makes puzzles feel like real investigation
 * - Solving connects directly to case progress
 * - Difficulty scales with evidence importance
 */

import { nanoid } from 'nanoid';
import { Puzzle, PuzzleComplexity } from './types';
import { NarrativeCase, TimelineEvent, CrimeDetails } from './narrative-engine';
import { SuspectCharacter } from './character-web';
import { EvidenceChain, EvidenceItem } from './evidence-chain';
import { generateUniquePuzzle } from './puzzle-generator';

// ============================================
// TYPES
// ============================================

export interface StoryPuzzle extends Puzzle {
  // Narrative integration
  narrativeContext: string;        // Story introduction for the puzzle
  investigationPhase: 'initial' | 'investigation' | 'conclusion';
  locationInStory: string;         // Where in the scene this puzzle appears

  // Revelation on completion
  revelation: PuzzleRevelation;

  // Character connection (optional)
  relatedCharacterId?: string;
  relatedCharacterName?: string;

  // Evidence connection
  unlocksEvidenceId?: string;
  verificationType?: 'alibi' | 'contradiction' | 'motive' | 'opportunity';
}

export interface PuzzleRevelation {
  type: 'evidence' | 'alibi_check' | 'timeline' | 'motive' | 'confession_clue';
  description: string;
  storyText: string;               // What the player reads after solving
  importance: 'minor' | 'moderate' | 'major';
}

export interface StoryPuzzleSet {
  caseId: string;
  puzzles: StoryPuzzle[];
  totalPoints: number;
  estimatedTotalMinutes: number;
  puzzlesByPhase: {
    initial: StoryPuzzle[];
    investigation: StoryPuzzle[];
    conclusion: StoryPuzzle[];
  };
}

// ============================================
// NARRATIVE PUZZLE CONTEXTS
// ============================================

interface PuzzleContextTemplate {
  phase: 'initial' | 'investigation' | 'conclusion';
  crimeTypes: CrimeDetails['type'][];
  contextTemplate: string;         // {crime}, {location}, {suspect}, {evidence} placeholders
  revelationTemplate: string;
  puzzleTypes: ('money' | 'time' | 'data' | 'ratio' | 'percentage' | 'speed')[];
  revelationType: PuzzleRevelation['type'];
  importance: PuzzleRevelation['importance'];
}

const PUZZLE_CONTEXT_TEMPLATES: PuzzleContextTemplate[] = [
  // ============================================
  // INITIAL PHASE - Scene examination
  // ============================================
  {
    phase: 'initial',
    crimeTypes: ['theft', 'fraud'],
    contextTemplate: `While examining the {location}, you find a financial ledger. The numbers look suspicious, but you need to verify if money is actually missing.`,
    revelationTemplate: `Your calculations reveal the truth: {revelation}. This is your first solid lead.`,
    puzzleTypes: ['money', 'data'],
    revelationType: 'evidence',
    importance: 'moderate',
  },
  {
    phase: 'initial',
    crimeTypes: ['sabotage', 'vandalism'],
    contextTemplate: `At the scene of the {crime}, you find a security log with timestamps. Analyzing the timeline could reveal who had opportunity.`,
    revelationTemplate: `The timeline analysis shows: {revelation}. This narrows down the suspects.`,
    puzzleTypes: ['time'],
    revelationType: 'timeline',
    importance: 'moderate',
  },
  {
    phase: 'initial',
    crimeTypes: ['theft', 'missing_item'],
    contextTemplate: `You discover an inventory sheet at the {location}. Calculating the discrepancy will show exactly what was taken.`,
    revelationTemplate: `Your analysis confirms: {revelation}. Now you know the full extent of the {crime}.`,
    puzzleTypes: ['percentage', 'money'],
    revelationType: 'evidence',
    importance: 'minor',
  },

  // ============================================
  // INVESTIGATION PHASE - Verification
  // ============================================
  {
    phase: 'investigation',
    crimeTypes: ['theft', 'fraud', 'sabotage'],
    contextTemplate: `{suspect} claims they were elsewhere during the crime. You need to calculate if their timeline makes sense.`,
    revelationTemplate: `After careful analysis: {revelation}. This either confirms or breaks their alibi!`,
    puzzleTypes: ['time', 'speed'],
    revelationType: 'alibi_check',
    importance: 'major',
  },
  {
    phase: 'investigation',
    crimeTypes: ['theft', 'fraud'],
    contextTemplate: `Records show suspicious transactions. Analyzing the pattern could reveal who benefited from the {crime}.`,
    revelationTemplate: `The numbers tell a story: {revelation}. You're getting closer to the truth.`,
    puzzleTypes: ['data', 'ratio'],
    revelationType: 'motive',
    importance: 'moderate',
  },
  {
    phase: 'investigation',
    crimeTypes: ['sabotage', 'cheating'],
    contextTemplate: `You've collected testimony from multiple witnesses. Cross-referencing their time estimates could reveal inconsistencies.`,
    revelationTemplate: `Your analysis uncovers a contradiction: {revelation}. Someone is not telling the truth!`,
    puzzleTypes: ['time'],
    revelationType: 'alibi_check',
    importance: 'major',
  },
  {
    phase: 'investigation',
    crimeTypes: ['theft', 'missing_item'],
    contextTemplate: `The suspect claims they couldn't have taken the items because of how they were divided. Check if their math adds up.`,
    revelationTemplate: `The ratio analysis proves: {revelation}. This is crucial evidence!`,
    puzzleTypes: ['ratio', 'percentage'],
    revelationType: 'alibi_check',
    importance: 'moderate',
  },

  // ============================================
  // CONCLUSION PHASE - Final proof
  // ============================================
  {
    phase: 'conclusion',
    crimeTypes: ['theft', 'fraud', 'sabotage', 'vandalism', 'missing_item', 'cheating'],
    contextTemplate: `You've gathered enough evidence. Now you need to piece together the final timeline to prove who committed the {crime}.`,
    revelationTemplate: `Your complete analysis reveals: {revelation}. You've solved the case!`,
    puzzleTypes: ['time', 'data'],
    revelationType: 'confession_clue',
    importance: 'major',
  },
  {
    phase: 'conclusion',
    crimeTypes: ['theft', 'fraud'],
    contextTemplate: `The financial trail needs one final analysis to prove guilt beyond doubt. Review all the evidence.`,
    revelationTemplate: `The evidence is conclusive: {revelation}. You've caught the culprit!`,
    puzzleTypes: ['money', 'data', 'percentage'],
    revelationType: 'evidence',
    importance: 'major',
  },
];

// ============================================
// REVELATION GENERATORS
// ============================================

function generateRevelation(
  template: PuzzleContextTemplate,
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[],
  evidence?: EvidenceItem
): PuzzleRevelation {
  const guiltyChar = characters.find(c => c.isGuilty);
  const innocentChar = characters.find(c => !c.isGuilty);

  // Generate revelation based on type
  let description: string;
  let storyText: string;

  switch (template.revelationType) {
    case 'alibi_check':
      if (template.phase === 'conclusion') {
        description = `${guiltyChar?.name}'s alibi is FALSE`;
        storyText = `Your calculations prove that ${guiltyChar?.name} (${guiltyChar?.role}) could NOT have been where they claimed. Their timeline doesn't add up - there's a gap of several minutes they can't explain. This matches exactly with the time the ${narrativeCase.crime.type} occurred!`;
      } else {
        description = template.importance === 'major'
          ? `One suspect's alibi has a major hole`
          : `You've verified part of a suspect's story`;
        storyText = `The math reveals a discrepancy. ${guiltyChar?.name}'s story has holes, while ${innocentChar?.name}'s timeline checks out. You're onto something!`;
      }
      break;

    case 'timeline':
      description = `Crime window narrowed down`;
      storyText = `Your timeline analysis shows the ${narrativeCase.crime.type} must have occurred between ${narrativeCase.crime.crimeWindow.start} and ${narrativeCase.crime.crimeWindow.end}. Only certain people were present during this window. This is a crucial breakthrough!`;
      break;

    case 'motive':
      description = `Motive revealed for ${guiltyChar?.role}`;
      storyText = `The numbers tell a story of ${narrativeCase.culprit.motive.type}. ${narrativeCase.culprit.motive.description}. This gives ${guiltyChar?.role} a clear reason to commit the ${narrativeCase.crime.type}!`;
      break;

    case 'evidence':
      if (evidence) {
        description = evidence.analysisResult;
        storyText = `Your analysis of the ${evidence.name} reveals ${evidence.analysisResult}. ${evidence.pointsToGuilty ? 'This evidence points toward the culprit!' : 'This helps narrow down the suspects.'}`;
      } else {
        description = `Key evidence found at ${narrativeCase.setting.location}`;
        storyText = `Your careful analysis of the scene has uncovered important evidence. The ${narrativeCase.crime.type} is becoming clearer.`;
      }
      break;

    case 'confession_clue':
      description = `Proof of guilt established`;
      storyText = `You've done it! Your investigation proves that ${guiltyChar?.name} (${guiltyChar?.role}) committed the ${narrativeCase.crime.type}. ${narrativeCase.culprit.method}. The evidence is undeniable: ${narrativeCase.culprit.mistakes[0]}.`;
      break;

    default:
      description = 'Investigation progresses';
      storyText = 'Your analysis has moved the investigation forward.';
  }

  return {
    type: template.revelationType,
    description,
    storyText: template.revelationTemplate.replace('{revelation}', description),
    importance: template.importance,
  };
}

// ============================================
// STORY PUZZLE GENERATION
// ============================================

function selectContextTemplate(
  phase: 'initial' | 'investigation' | 'conclusion',
  crimeType: CrimeDetails['type']
): PuzzleContextTemplate {
  const matching = PUZZLE_CONTEXT_TEMPLATES.filter(
    t => t.phase === phase && t.crimeTypes.includes(crimeType)
  );

  if (matching.length === 0) {
    // Fallback to any template for this phase
    const fallback = PUZZLE_CONTEXT_TEMPLATES.filter(t => t.phase === phase);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return matching[Math.floor(Math.random() * matching.length)];
}

function mapComplexityToPhase(
  phase: 'initial' | 'investigation' | 'conclusion',
  baseDifficulty: 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF'
): PuzzleComplexity {
  const difficultyMap = {
    ROOKIE: { initial: 'BASIC', investigation: 'STANDARD', conclusion: 'STANDARD' },
    INSPECTOR: { initial: 'STANDARD', investigation: 'STANDARD', conclusion: 'CHALLENGING' },
    DETECTIVE: { initial: 'STANDARD', investigation: 'CHALLENGING', conclusion: 'CHALLENGING' },
    CHIEF: { initial: 'CHALLENGING', investigation: 'CHALLENGING', conclusion: 'EXPERT' },
  } as const;

  return difficultyMap[baseDifficulty][phase] as PuzzleComplexity;
}

/**
 * Generate a single story-integrated puzzle
 */
export function generateStoryPuzzle(
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[],
  evidenceChain: EvidenceChain,
  phase: 'initial' | 'investigation' | 'conclusion',
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  existingTitles: string[] = []
): StoryPuzzle {
  // Select context template
  const contextTemplate = selectContextTemplate(phase, narrativeCase.crime.type);

  // Determine complexity based on phase and case difficulty
  const complexity = mapComplexityToPhase(phase, narrativeCase.difficulty);

  // Generate base puzzle
  const basePuzzle = generateUniquePuzzle(subject, complexity, existingTitles);

  // Find related evidence (if investigation or conclusion phase)
  let relatedEvidence: EvidenceItem | undefined;
  if (phase === 'investigation') {
    relatedEvidence = evidenceChain.discoveredEvidence[0];
  } else if (phase === 'conclusion') {
    relatedEvidence = evidenceChain.conclusiveEvidence[0];
  } else {
    relatedEvidence = evidenceChain.initialEvidence.find(e => e.importance !== 'misleading');
  }

  // Find related character
  const guiltyChar = characters.find(c => c.isGuilty);
  const relatedChar = phase === 'conclusion' ? guiltyChar : characters[Math.floor(Math.random() * characters.length)];

  // Generate narrative context
  const narrativeContext = contextTemplate.contextTemplate
    .replace('{location}', narrativeCase.setting.location)
    .replace('{crime}', narrativeCase.crime.type.replace('_', ' '))
    .replace('{suspect}', relatedChar?.name || 'A suspect')
    .replace('{evidence}', relatedEvidence?.name || 'the evidence');

  // Generate revelation
  const revelation = generateRevelation(contextTemplate, narrativeCase, characters, relatedEvidence);

  // Determine verification type based on revelation
  let verificationType: StoryPuzzle['verificationType'];
  switch (contextTemplate.revelationType) {
    case 'alibi_check':
      verificationType = 'alibi';
      break;
    case 'motive':
      verificationType = 'motive';
      break;
    case 'timeline':
      verificationType = 'opportunity';
      break;
    default:
      verificationType = undefined;
  }

  return {
    ...basePuzzle,
    narrativeContext,
    investigationPhase: phase,
    locationInStory: narrativeCase.setting.location,
    revelation,
    relatedCharacterId: relatedChar?.id,
    relatedCharacterName: relatedChar?.name,
    unlocksEvidenceId: relatedEvidence?.id,
    verificationType,
  };
}

/**
 * Generate a complete set of story-integrated puzzles for a case
 */
export function generateStoryPuzzleSet(
  narrativeCase: NarrativeCase,
  characters: SuspectCharacter[],
  evidenceChain: EvidenceChain,
  subject: 'MATH' | 'SCIENCE' | 'INTEGRATED',
  puzzleCount: number = 4
): StoryPuzzleSet {
  const puzzles: StoryPuzzle[] = [];
  const usedTitles: string[] = [];

  // Distribute puzzles across phases
  // Typical distribution: 1 initial, 2 investigation, 1 conclusion
  const phaseDistribution = puzzleCount <= 2
    ? { initial: 1, investigation: 0, conclusion: 1 }
    : puzzleCount === 3
    ? { initial: 1, investigation: 1, conclusion: 1 }
    : { initial: 1, investigation: Math.floor((puzzleCount - 2) / 2) + 1, conclusion: Math.ceil((puzzleCount - 2) / 2) };

  // Generate initial phase puzzles
  for (let i = 0; i < phaseDistribution.initial; i++) {
    const puzzle = generateStoryPuzzle(
      narrativeCase, characters, evidenceChain,
      'initial', subject, usedTitles
    );
    puzzles.push(puzzle);
    usedTitles.push(puzzle.title);
  }

  // Generate investigation phase puzzles
  for (let i = 0; i < phaseDistribution.investigation; i++) {
    const puzzle = generateStoryPuzzle(
      narrativeCase, characters, evidenceChain,
      'investigation', subject, usedTitles
    );
    puzzles.push(puzzle);
    usedTitles.push(puzzle.title);
  }

  // Generate conclusion phase puzzles
  for (let i = 0; i < phaseDistribution.conclusion; i++) {
    const puzzle = generateStoryPuzzle(
      narrativeCase, characters, evidenceChain,
      'conclusion', subject, usedTitles
    );
    puzzles.push(puzzle);
    usedTitles.push(puzzle.title);
  }

  // Calculate totals
  const totalPoints = puzzles.reduce((sum, p) => sum + p.points, 0);
  const estimatedTotalMinutes = puzzles.reduce((sum, p) => sum + p.estimatedMinutes, 0);

  return {
    caseId: narrativeCase.id,
    puzzles,
    totalPoints,
    estimatedTotalMinutes,
    puzzlesByPhase: {
      initial: puzzles.filter(p => p.investigationPhase === 'initial'),
      investigation: puzzles.filter(p => p.investigationPhase === 'investigation'),
      conclusion: puzzles.filter(p => p.investigationPhase === 'conclusion'),
    },
  };
}

// ============================================
// HELPER EXPORTS
// ============================================

/**
 * Get puzzles for a specific phase
 */
export function getPuzzlesForPhase(
  puzzleSet: StoryPuzzleSet,
  phase: 'initial' | 'investigation' | 'conclusion'
): StoryPuzzle[] {
  return puzzleSet.puzzlesByPhase[phase];
}

/**
 * Get the puzzle revelation text
 */
export function getPuzzleRevelationText(puzzle: StoryPuzzle): string {
  return puzzle.revelation.storyText;
}

/**
 * Check if solving this puzzle is required for case completion
 */
export function isPuzzleRequired(puzzle: StoryPuzzle): boolean {
  return puzzle.revelation.importance === 'major' ||
    puzzle.investigationPhase === 'conclusion';
}

/**
 * Get all required puzzles from a set
 */
export function getRequiredPuzzles(puzzleSet: StoryPuzzleSet): StoryPuzzle[] {
  return puzzleSet.puzzles.filter(isPuzzleRequired);
}

/**
 * Calculate minimum points needed to solve case
 */
export function getMinimumPointsToSolve(puzzleSet: StoryPuzzleSet): number {
  return getRequiredPuzzles(puzzleSet)
    .reduce((sum, p) => sum + p.points, 0);
}

/**
 * Format puzzle for presentation with narrative context
 */
export function formatStoryPuzzlePresentation(puzzle: StoryPuzzle): {
  introduction: string;
  puzzle: string;
  hint: string;
  successMessage: string;
} {
  return {
    introduction: `📍 ${puzzle.locationInStory}\n\n${puzzle.narrativeContext}`,
    puzzle: puzzle.question,
    hint: `💡 Hint: ${puzzle.hint}`,
    successMessage: `✓ PUZZLE SOLVED!\n\n${puzzle.revelation.storyText}`,
  };
}
