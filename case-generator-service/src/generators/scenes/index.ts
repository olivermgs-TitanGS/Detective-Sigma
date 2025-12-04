import { GenerationRequest, Scene, Clue } from '../../types';
import { StoryOutput } from '../story';
import { createGeneratorLogger } from '../../utils/logger';

const logger = createGeneratorLogger('scenes');

export async function generateScenes(
  request: GenerationRequest,
  story: StoryOutput,
  clues: Clue[],
  strategy: 'template' | 'ai' | 'hybrid'
): Promise<Scene[]> {
  logger.info({ strategy, location: story.location }, 'Generating scenes');

  const scenes: Scene[] = [
    {
      id: 'scene-1',
      name: `${story.location} - Main Area`,
      description: `The primary location where the incident occurred. ${story.setting}`,
      interactiveElements: ['cash-register', 'receipts', 'counter'],
      cluesAvailable: clues.slice(0, 2).map((c) => c.id),
    },
    {
      id: 'scene-2',
      name: 'Storage/Back Area',
      description: 'The back room or storage area accessible only to staff members.',
      interactiveElements: ['inventory-log', 'lockers', 'supply-shelf'],
      cluesAvailable: clues.slice(2, 4).map((c) => c.id),
    },
    {
      id: 'scene-3',
      name: 'Interview Room',
      description: 'A quiet space where you can interview suspects and review evidence.',
      interactiveElements: ['evidence-board', 'suspect-files', 'notes'],
      cluesAvailable: clues.slice(4).map((c) => c.id),
    },
  ];

  logger.info({ count: scenes.length }, 'Generated scenes');

  return scenes;
}
