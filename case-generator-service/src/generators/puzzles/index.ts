import { GenerationRequest, Puzzle } from '../../types';
import { StoryOutput } from '../story';
import { createGeneratorLogger } from '../../utils/logger';
import { getAIAdapter } from '../../ai/adapter-factory';

const logger = createGeneratorLogger('puzzles');

export async function generatePuzzles(
  request: GenerationRequest,
  story: StoryOutput,
  strategy: 'template' | 'ai' | 'hybrid'
): Promise<Puzzle[]> {
  logger.info({ strategy, subject: request.subject, gradeLevel: request.gradeLevel }, 'Generating puzzles');

  const puzzleCount = getDifficultyPuzzleCount(request.difficulty);

  if (strategy === 'template' || strategy === 'hybrid') {
    return generateFromTemplate(request, story, puzzleCount);
  } else {
    return generateWithAI(request, story, puzzleCount);
  }
}

function getDifficultyPuzzleCount(difficulty: string): number {
  switch (difficulty) {
    case 'ROOKIE':
      return 3;
    case 'INSPECTOR':
      return 4;
    case 'DETECTIVE':
      return 5;
    case 'CHIEF':
      return 6;
    default:
      return 4;
  }
}

function generateFromTemplate(
  request: GenerationRequest,
  story: StoryOutput,
  count: number
): Puzzle[] {
  const puzzles: Puzzle[] = [];
  const { subject, gradeLevel, difficulty } = request;

  for (let i = 0; i < count; i++) {
    if (subject === 'MATH' || subject === 'INTEGRATED') {
      puzzles.push(generateMathPuzzle(i + 1, gradeLevel, difficulty, story));
    } else if (subject === 'SCIENCE') {
      puzzles.push(generateSciencePuzzle(i + 1, gradeLevel, difficulty, story));
    }
  }

  logger.info({ count: puzzles.length }, 'Generated puzzles from template');

  return puzzles;
}

function generateMathPuzzle(index: number, _gradeLevel: string, difficulty: string, _story: StoryOutput): Puzzle {
  const difficultyMultiplier = {
    ROOKIE: 1,
    INSPECTOR: 1.5,
    DETECTIVE: 2,
    CHIEF: 2.5,
  }[difficulty] || 1;

  const templates = [
    {
      title: 'Calculate Missing Amount',
      question: `The cash register started with $200. Sales receipts show $145 collected. The register now has $295. How much money is missing or extra?`,
      answer: '$50 missing (200 + 145 = 345, but register has 295, so 345 - 295 = 50 missing)',
      hint: 'Calculate what should be in the register, then compare with actual amount.',
      type: 'math' as const,
    },
    {
      title: 'Time Analysis',
      question: `Receipt A is stamped 9:15 AM, Receipt B at 9:47 AM. How many minutes passed between transactions?`,
      answer: '32 minutes',
      hint: 'Subtract the start time from the end time.',
      type: 'math' as const,
    },
    {
      title: 'Pattern Recognition',
      question: `Transactions occurred at 8:15, 8:30, 8:45, 9:00. If the pattern continues, when is the next transaction?`,
      answer: '9:15 AM',
      hint: 'Look for the time difference between each transaction.',
      type: 'logic' as const,
    },
  ];

  const template = templates[index % templates.length];
  const points = Math.round(20 * difficultyMultiplier);

  return {
    id: `puzzle-${index}`,
    title: template.title,
    type: template.type,
    question: template.question,
    answer: template.answer,
    hint: template.hint,
    points,
    difficulty: difficultyMultiplier,
  };
}

function generateSciencePuzzle(index: number, _gradeLevel: string, difficulty: string, _story: StoryOutput): Puzzle {
  const difficultyMultiplier = {
    ROOKIE: 1,
    INSPECTOR: 1.5,
    DETECTIVE: 2,
    CHIEF: 2.5,
  }[difficulty] || 1;

  const templates = [
    {
      title: 'Fingerprint Analysis',
      question: `Three fingerprints were found. Two match suspects. What scientific method would you use to identify the third?`,
      answer: 'Compare ridge patterns, minutiae points, and unique characteristics with known fingerprint samples.',
      hint: 'Think about how forensic scientists compare fingerprints.',
      type: 'observation' as const,
    },
    {
      title: 'Chemical Test',
      question: `A white powder was found. What safe tests could identify if it's salt, sugar, or flour?`,
      answer: 'Taste test (if safe), dissolve in water (salt and sugar dissolve, flour doesn\'t), or burn test (flour browns, sugar caramelizes, salt doesn\'t change).',
      hint: 'Consider the physical and chemical properties of each substance.',
      type: 'deduction' as const,
    },
  ];

  const template = templates[index % templates.length];
  const points = Math.round(20 * difficultyMultiplier);

  return {
    id: `puzzle-${index}`,
    title: template.title,
    type: template.type,
    question: template.question,
    answer: template.answer,
    hint: template.hint,
    points,
    difficulty: difficultyMultiplier,
  };
}

async function generateWithAI(
  request: GenerationRequest,
  story: StoryOutput,
  count: number
): Promise<Puzzle[]> {
  const adapter = getAIAdapter('openai');

  const prompt = `
Generate ${count} educational puzzles for a detective case:

**Story**: ${story.title}
**Subject**: ${request.subject}
**Grade Level**: ${request.gradeLevel} (Primary 4-6)
**Difficulty**: ${request.difficulty}

Each puzzle should:
1. Be solvable using ${request.subject.toLowerCase()} skills appropriate for ${request.gradeLevel}
2. Be related to the case context
3. Have a clear, verifiable answer
4. Include a helpful hint
5. Be age-appropriate and engaging

Return ONLY a valid JSON array:
[
  {
    "id": "puzzle-1",
    "title": "...",
    "type": "math|logic|observation|deduction",
    "question": "...",
    "answer": "...",
    "hint": "...",
    "points": 20,
    "difficulty": 1
  },
  ...
]
  `.trim();

  const response = await adapter.generateCompletion(prompt, { temperature: 0.7 });
  const puzzles = JSON.parse(response);

  logger.info({ count: puzzles.length }, 'Generated puzzles with AI');

  return puzzles;
}
