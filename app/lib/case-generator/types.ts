import { z } from 'zod';

export const DifficultyEnum = z.enum(['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF']);
export const SubjectEnum = z.enum(['MATH', 'SCIENCE', 'INTEGRATED']);
export const GradeLevelEnum = z.enum(['P4', 'P5', 'P6']);
export const ComplexityEnum = z.enum(['SIMPLE', 'MEDIUM', 'COMPLEX']);

export const GenerationRequestSchema = z.object({
  difficulty: DifficultyEnum,
  subject: SubjectEnum,
  gradeLevel: GradeLevelEnum,
  complexity: ComplexityEnum.optional(),
  constraints: z.object({
    excludeThemes: z.array(z.string()).optional(),
    requiredSkills: z.array(z.string()).optional(),
    estimatedMinutes: z.number().min(20).max(30).optional(),
  }).optional(),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type Difficulty = z.infer<typeof DifficultyEnum>;
export type Subject = z.infer<typeof SubjectEnum>;
export type GradeLevel = z.infer<typeof GradeLevelEnum>;

export interface GeneratedCase {
  caseId: string;
  title: string;
  briefing: string;
  metadata: {
    difficulty: string;
    gradeLevel: string;
    subjectFocus: string;
    estimatedMinutes: number;
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
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  interactiveElements: string[];
  cluesAvailable: string[];
}
