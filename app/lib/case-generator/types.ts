import { z } from 'zod';

export const DifficultyEnum = z.enum(['ROOKIE', 'INSPECTOR', 'DETECTIVE', 'CHIEF']);
export const SubjectEnum = z.enum(['MATH', 'SCIENCE', 'INTEGRATED']);
export const GradeLevelEnum = z.enum(['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);
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
  // Syllabus-based generation options
  useSyllabus: z.boolean().default(true), // Use curriculum-aligned puzzles
  topicIds: z.array(z.string()).optional(), // Specific topics to cover
  constraints: z.object({
    excludeThemes: z.array(z.string()).optional(),
    requiredSkills: z.array(z.string()).optional(),
    estimatedMinutes: z.number().min(15).max(90).optional(),
    minPuzzles: z.number().min(2).max(25).optional(),
  }).optional(),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type Difficulty = z.infer<typeof DifficultyEnum>;
export type Subject = z.infer<typeof SubjectEnum>;
export type GradeLevel = z.infer<typeof GradeLevelEnum>;
export type PuzzleComplexity = z.infer<typeof PuzzleComplexityEnum>;

// Image generation request interface
export interface ImageRequest {
  id: string;
  type: 'scene' | 'suspect' | 'evidence' | 'clue' | 'puzzle' | 'cover';
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  settings: {
    model: string;
    sampler: string;
    steps: number;
    cfgScale: number;
    seed?: number;
  };
  metadata: Record<string, unknown>;
  // Generated result (filled after image generation)
  generatedUrl?: string;
  generatedBase64?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
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
    // Syllabus tracking
    syllabusTopicsCovered?: string[]; // Topic IDs covered in this case
    learningObjectives?: string[];    // Learning objective IDs addressed
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
  // Image generation requests (for Pony Diffusion V6)
  imageRequests?: {
    cover: ImageRequest;
    scenes: ImageRequest[];
    suspects: ImageRequest[];
    evidence: ImageRequest[];
  };
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  alibi: string;
  personality: string[];
  isGuilty: boolean;
  motive?: string;
  // Visual representation
  imageRequest?: ImageRequest;
  ethnicity?: 'Chinese' | 'Malay' | 'Indian' | 'Eurasian';
  gender?: 'male' | 'female';
  ageGroup?: 'young' | 'middle' | 'senior';
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  type: 'physical' | 'document' | 'testimony' | 'digital';
  relevance: 'critical' | 'supporting' | 'red-herring';
  linkedTo: string[];
  // Enhanced clue data
  imageRequest?: ImageRequest;
  discoveryLocation?: string;
  examinationDetails?: string[];
  relatedTopicId?: string;
  puzzleHint?: string;
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
  // Syllabus alignment
  topicId?: string;                    // Syllabus topic ID
  learningObjectivesCovered?: string[]; // Learning objectives addressed
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  interactiveElements: string[];
  cluesAvailable: string[];
  // Enhanced scene data
  imageRequest?: ImageRequest;
  locationType?: string;
  ambiance?: 'day' | 'night' | 'evening' | 'morning';
  mood?: 'mysterious' | 'tense' | 'calm' | 'urgent';
  interactiveAreas?: {
    name: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }[];
}
