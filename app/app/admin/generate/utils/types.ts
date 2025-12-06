/**
 * Type definitions for the case generator
 * These types mirror the full GeneratedCase from lib/case-generator/types.ts
 */

export type Difficulty = 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
export type Subject = 'MATH' | 'SCIENCE' | 'INTEGRATED';
export type GradeLevel = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
export type PuzzleComplexity = 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';
export type ContentRating = 'GENERAL' | 'PG13' | 'ADV16' | 'M18';

// Puzzle revelation for story progression
export interface PuzzleRevelation {
  type: 'evidence' | 'alibi_check' | 'timeline' | 'motive' | 'confession_clue';
  description: string;
  storyText: string;
  importance: 'minor' | 'moderate' | 'major';
}

export interface GeneratedCase {
  caseId: string;
  title: string;
  briefing: string;
  metadata: {
    difficulty: string;
    gradeLevel: string;
    subjectFocus: string;
    estimatedMinutes: number;
    puzzleComplexity?: string;
    syllabusTopicsCovered?: string[];
    learningObjectives?: string[];
  };
  story: {
    setting: string;
    crime: string;
    resolution: string;
    backstory?: string;
    incident?: string;
    investigationHints?: string[];
    twist?: string;
    timeline?: Array<{
      id: string;
      time: string;
      timeMinutes: number;
      description: string;
      location: string;
      involvedCharacters: string[];
      isKeyEvent: boolean;
      discoverable: boolean;
    }>;
    crimeWindow?: { start: string; end: string };
    culpritProfile?: {
      motive: { type: string; description: string; backstory: string };
      method: string;
      mistakes: string[];
    };
  };
  suspects: Array<{
    id: string;
    name: string;
    role: string;
    alibi: string;
    personality: string[];
    isGuilty: boolean;
    motive?: string;
    ethnicity?: 'Chinese' | 'Malay' | 'Indian' | 'Eurasian';
    gender?: 'male' | 'female';
    ageGroup?: 'young' | 'middle' | 'senior';
    ageCategory?: 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior';
    specificAge?: number;
    displayAge?: string;
    dialogueTree?: Array<{
      id: string;
      question: string;
      answer: string;
      emotion?: 'calm' | 'nervous' | 'defensive' | 'helpful' | 'evasive' | 'angry';
      revealsInfo?: string;
      contradictsId?: string;
      unlocksNodeId?: string;
      requiresEvidence?: string;
    }>;
    relationships?: Array<{
      targetId: string;
      targetName: string;
      type: 'friendly' | 'neutral' | 'tense' | 'hostile' | 'professional' | 'family';
      description: string;
    }>;
  }>;
  scenes: Array<{
    id: string;
    name: string;
    description: string;
    interactiveElements?: string[];
    cluesAvailable?: string[];
    locationType?: string;
    ambiance?: 'day' | 'night' | 'evening' | 'morning';
    mood?: 'mysterious' | 'tense' | 'calm' | 'urgent';
  }>;
  clues: Array<{
    id: string;
    title: string;
    description: string;
    type: 'physical' | 'document' | 'testimony' | 'digital';
    relevance: 'critical' | 'supporting' | 'red-herring';
    linkedTo?: string[];
    visualCue?: string;
    analysisResult?: string;
    discoveryMethod?: string;
    discoveryLocation?: string;
    examinationDetails?: string[];
    relatedTopicId?: string;
    puzzleHint?: string;
  }>;
  puzzles: Array<{
    id: string;
    title: string;
    type: 'math' | 'logic' | 'observation' | 'deduction';
    question: string;
    answer: string;
    hint: string;
    points: number;
    difficulty: number;
    complexity: 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';
    estimatedMinutes: number;
    requiresMultipleSteps: boolean;
    dataTablesProvided?: string[];
    topicId?: string;
    learningObjectivesCovered?: string[];
    // Narrative revelation system
    narrativeContext?: string;
    investigationPhase?: 'initial' | 'investigation' | 'conclusion';
    revelation?: PuzzleRevelation;
    relatedCharacterName?: string;
  }>;
  // Evidence chain for game logic
  evidenceChain?: {
    mainPath: string[];
    criticalCount: number;
  };
  // Puzzle phases for progressive revelation
  puzzlePhases?: {
    initial: string[];
    investigation: string[];
    conclusion: string[];
  };
}

export interface GeneratedImages {
  cover?: string;
  suspects: Record<string, string>;
  scenes: Record<string, string>;
  clues: Record<string, string>;
}

export interface ImageGenProgress {
  current: string;
  completed: number;
  total: number;
}

export interface PersonInfo {
  gender: string;
  age: string;
  ageDescriptor: string;
  agePrompt: string;
  religiousAttire: string;
  religion: string | null;
}

export interface EthnicityInfo {
  ethnicity: string;
  skinTone: string;
  features: string;
  race: string;
}
