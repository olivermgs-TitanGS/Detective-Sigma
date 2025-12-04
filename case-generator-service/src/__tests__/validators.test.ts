import { validateQuality } from '../validators/quality';
import { GeneratedCase, GenerationRequest } from '../types';

// Mock the uniqueness checker
jest.mock('../validators/uniqueness', () => ({
  checkUniqueness: jest.fn().mockResolvedValue({
    isUnique: true,
    similarCases: [],
    similarityScore: 0,
  }),
}));

// Mock the config
jest.mock('../config', () => ({
  config: {
    generation: {
      minUniquenessScore: 0.85,
    },
  },
}));

// Mock the logger
jest.mock('../utils/logger', () => ({
  createGeneratorLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('Quality Validator', () => {
  const mockRequest: GenerationRequest = {
    difficulty: 'ROOKIE',
    subject: 'MATH',
    gradeLevel: 'P4',
  };

  const createValidCase = (): GeneratedCase => ({
    caseId: 'test-case-1',
    title: 'The Missing Calculator',
    briefing: 'A calculator has gone missing from the classroom.',
    metadata: {
      difficulty: 'ROOKIE',
      gradeLevel: 'P4',
      subjectFocus: 'MATH',
      estimatedMinutes: 30,
      uniquenessScore: 0,
      generationStrategy: 'template',
    },
    story: {
      setting: 'School classroom',
      crime: 'Missing item',
      resolution: 'Found by analyzing clues',
    },
    suspects: [
      {
        id: 'suspect-1',
        name: 'Test Person 1',
        role: 'Student',
        alibi: 'Was in class',
        personality: ['nervous', 'helpful'],
        isGuilty: false,
      },
      {
        id: 'suspect-2',
        name: 'Test Person 2',
        role: 'Teacher',
        alibi: 'Was in office',
        personality: ['calm', 'organized'],
        isGuilty: true,
        motive: 'Needed to cover mistake',
      },
    ],
    clues: [
      {
        id: 'clue-1',
        title: 'Fingerprint',
        description: 'Found on the desk',
        type: 'physical',
        relevance: 'critical',
        linkedTo: ['suspect-2'],
      },
      {
        id: 'clue-2',
        title: 'Witness statement',
        description: 'Saw someone near the desk',
        type: 'testimony',
        relevance: 'critical',
        linkedTo: ['suspect-2'],
      },
    ],
    puzzles: [
      {
        id: 'puzzle-1',
        title: 'Calculate time',
        type: 'math',
        question: '2 + 2',
        answer: '4',
        hint: 'Add the numbers',
        points: 10,
        difficulty: 1,
      },
      {
        id: 'puzzle-2',
        title: 'Pattern',
        type: 'logic',
        question: 'What comes next: 1, 2, 3, ?',
        answer: '4',
        hint: 'Count up',
        points: 10,
        difficulty: 1,
      },
      {
        id: 'puzzle-3',
        title: 'Observation',
        type: 'observation',
        question: 'What is different?',
        answer: 'The color',
        hint: 'Look carefully',
        points: 10,
        difficulty: 1,
      },
    ],
    scenes: [
      {
        id: 'scene-1',
        name: 'Classroom',
        description: 'The main classroom',
        interactiveElements: ['desk', 'chair'],
        cluesAvailable: ['clue-1'],
      },
      {
        id: 'scene-2',
        name: 'Office',
        description: 'The teacher office',
        interactiveElements: ['computer'],
        cluesAvailable: ['clue-2'],
      },
    ],
    assets: {
      cover: { type: 'image', metadata: {} },
      scenes: {},
      suspects: {},
      clues: {},
    },
    fingerprint: {
      structureHash: 'abc123',
      characterHash: 'def456',
      puzzleHash: 'ghi789',
      locationHash: 'jkl012',
      combinedHash: 'combined123',
      timestamp: new Date(),
    },
  });

  it('should validate a valid case', async () => {
    const validCase = createValidCase();
    const result = await validateQuality(validCase, mockRequest);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject case with less than 2 suspects', async () => {
    const invalidCase = createValidCase();
    invalidCase.suspects = [invalidCase.suspects[0]];
    
    const result = await validateQuality(invalidCase, mockRequest);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Must have at least 2 suspects');
  });

  it('should reject case with no guilty suspect', async () => {
    const invalidCase = createValidCase();
    invalidCase.suspects.forEach((s) => (s.isGuilty = false));
    
    const result = await validateQuality(invalidCase, mockRequest);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('exactly 1 guilty suspect'))).toBe(true);
  });

  it('should reject case with less than 3 puzzles', async () => {
    const invalidCase = createValidCase();
    invalidCase.puzzles = invalidCase.puzzles.slice(0, 2);
    
    const result = await validateQuality(invalidCase, mockRequest);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Must have at least 3 puzzles');
  });

  it('should reject case with less than 2 scenes', async () => {
    const invalidCase = createValidCase();
    invalidCase.scenes = [invalidCase.scenes[0]];
    
    const result = await validateQuality(invalidCase, mockRequest);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Must have at least 2 scenes');
  });

  it('should reject case with inappropriate content', async () => {
    const invalidCase = createValidCase();
    invalidCase.title = 'The Murder Mystery';
    
    const result = await validateQuality(invalidCase, mockRequest);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('inappropriate word: murder'))).toBe(true);
  });
});
