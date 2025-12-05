/**
 * Type definitions for the case generator
 */

export type Difficulty = 'ROOKIE' | 'INSPECTOR' | 'DETECTIVE' | 'CHIEF';
export type Subject = 'MATH' | 'SCIENCE' | 'INTEGRATED';
export type GradeLevel = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
export type PuzzleComplexity = 'BASIC' | 'STANDARD' | 'CHALLENGING' | 'EXPERT';

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
  };
  story: {
    setting: string;
    crime: string;
    resolution: string;
  };
  suspects: Array<{
    id: string;
    name: string;
    role: string;
    alibi: string;
    isGuilty: boolean;
  }>;
  scenes: Array<{
    id: string;
    name: string;
    description: string;
    locationType?: string;
  }>;
  clues: Array<{
    id: string;
    title: string;
    description: string;
    type: 'physical' | 'document' | 'testimony' | 'digital';
    relevance: 'critical' | 'supporting' | 'red-herring';
  }>;
  puzzles: Array<{
    id: string;
    title: string;
    question: string;
    answer: string;
    points: number;
  }>;
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
