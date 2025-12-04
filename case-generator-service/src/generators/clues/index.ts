import { GenerationRequest, Clue, Suspect, Puzzle } from '../../types';
import { StoryOutput } from '../story';
import { createGeneratorLogger } from '../../utils/logger';

const logger = createGeneratorLogger('clues');

export async function generateClues(
  request: GenerationRequest,
  story: StoryOutput,
  suspects: Suspect[],
  puzzles: Puzzle[],
  strategy: 'template' | 'ai' | 'hybrid'
): Promise<Clue[]> {
  logger.info({ strategy }, 'Generating clues');

  const clueCount = 5 + Math.floor(Math.random() * 3); // 5-7 clues
  const clues: Clue[] = [];

  // Generate critical clues (linked to guilty suspect)
  const guiltySuspect = suspects.find((s) => s.isGuilty);
  if (guiltySuspect) {
    clues.push({
      id: 'clue-1',
      title: 'Financial Records',
      description: `Receipt with timestamp and amount that contradicts ${guiltySuspect.name}'s alibi.`,
      type: 'document',
      relevance: 'critical',
      linkedTo: [guiltySuspect.id, puzzles[0]?.id].filter(Boolean),
    });

    clues.push({
      id: 'clue-2',
      title: 'Witness Statement',
      description: `Someone saw ${guiltySuspect.name} near the scene at the time of the incident.`,
      type: 'testimony',
      relevance: 'critical',
      linkedTo: [guiltySuspect.id],
    });
  }

  // Generate supporting clues
  clues.push({
    id: 'clue-3',
    title: 'Security Log',
    description: 'Access records showing who entered and exited the area during the relevant time period.',
    type: 'digital',
    relevance: 'supporting',
    linkedTo: suspects.map((s) => s.id),
  });

  clues.push({
    id: 'clue-4',
    title: 'Fingerprints',
    description: 'Partial fingerprints found on relevant surfaces.',
    type: 'physical',
    relevance: 'supporting',
    linkedTo: suspects.slice(0, 2).map((s) => s.id),
  });

  // Generate red herrings
  clues.push({
    id: 'clue-5',
    title: 'Unrelated Note',
    description: 'A note found at the scene that turns out to be unrelated to the case.',
    type: 'document',
    relevance: 'red-herring',
    linkedTo: [],
  });

  logger.info({ count: clues.length }, 'Generated clues');

  return clues.slice(0, clueCount);
}
