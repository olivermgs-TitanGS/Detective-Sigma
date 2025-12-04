import { z } from 'zod';

export const DifficultyEnum = z.enum(['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF']);
export const SubjectEnum = z.enum(['MATH', 'SCIENCE', 'INTEGRATED']);
export const GradeLevelEnum = z.enum(['P4', 'P5', 'P6', 'SECONDARY', 'ADULT']);
// Puzzle complexity determines how challenging each puzzle is
// BASIC: Simple single-step problems (2-3 min each)
// STANDARD: Multi-step problems requiring some reasoning (5-7 min each)
// CHALLENGING: Complex multi-step with cross-referencing (10-15 min each)
// EXPERT: Layered puzzles with red herrings, requires deep analysis (15-25 min each)
export const PuzzleComplexityEnum = z.enum(['BASIC', 'STANDARD', 'CHALLENGING', 'EXPERT']);

export const GenerationRequestSchema = z.object({
  difficulty: DifficultyEnum,
  subject: SubjectEnum,
  gradeLevel: GradeLevelEnum,
  puzzleComplexity: PuzzleComplexityEnum.default('STANDARD'),
  constraints: z.object({
    excludeThemes: z.array(z.string()).optional(),
    requiredSkills: z.array(z.string()).optional(),
    estimatedMinutes: z.number().min(15).max(90).optional(),
    minPuzzles: z.number().min(2).max(8).optional(),
  }).optional(),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type Difficulty = z.infer<typeof DifficultyEnum>;
export type Subject = z.infer<typeof SubjectEnum>;
export type GradeLevel = z.infer<typeof GradeLevelEnum>;
export type PuzzleComplexity = z.infer<typeof PuzzleComplexityEnum>;

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
  suspects: Suspect[];
  clues: Clue[];
  puzzles: Puzzle[];
  scenes: Scene[];
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  alibi: string;
  personality: string[];
  isGuilty: boolean;
  motive?: string;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  type: 'physical' | 'document' | 'testimony' | 'digital';
  relevance: 'critical' | 'supporting' | 'red-herring';
  linkedTo: string[];
}

export interface Puzzle {
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
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  interactiveElements: string[];
  cluesAvailable: string[];
}
