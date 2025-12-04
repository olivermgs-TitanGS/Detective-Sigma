import { z } from 'zod';

export const DifficultyEnum = z.enum(['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF']);
export const SubjectEnum = z.enum(['MATH', 'SCIENCE', 'INTEGRATED']);
export const GradeLevelEnum = z.enum(['P4', 'P5', 'P6']);

export const GenerationRequestSchema = z.object({
  difficulty: DifficultyEnum,
  subject: SubjectEnum,
  gradeLevel: GradeLevelEnum,
  constraints: z.object({
    excludeThemes: z.array(z.string()).optional(),
    requiredSkills: z.array(z.string()).optional(),
    estimatedMinutes: z.number().min(15).max(120).optional(),
    location: z.string().optional(),
    characterCount: z.number().min(2).max(5).optional(),
  }).optional(),
  preferences: z.object({
    culturalContext: z.enum(['singapore', 'generic']).default('singapore'),
    includeAssets: z.boolean().default(true),
    strategy: z.enum(['template', 'ai', 'hybrid']).default('hybrid'),
  }).optional(),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;

export interface GeneratedCase {
  caseId: string;
  title: string;
  briefing: string;
  metadata: {
    difficulty: string;
    gradeLevel: string;
    subjectFocus: string;
    estimatedMinutes: number;
    uniquenessScore: number;
    generationStrategy: string;
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
  assets: AssetManifest;
  fingerprint: CaseFingerprint;
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
  linkedTo: string[]; // IDs of suspects/puzzles
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

export interface AssetManifest {
  cover: AssetSpec;
  scenes: { [key: string]: AssetSpec };
  suspects: { [key: string]: AssetSpec };
  clues: { [key: string]: AssetSpec };
}

export interface AssetSpec {
  type: 'image' | 'document' | 'audio';
  prompt?: string;
  url?: string;
  metadata: Record<string, any>;
}

export interface CaseFingerprint {
  structureHash: string;
  characterHash: string;
  puzzleHash: string;
  locationHash: string;
  combinedHash: string;
  timestamp: Date;
}

export interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  request: GenerationRequest;
  result?: GeneratedCase;
  error?: string;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
}
