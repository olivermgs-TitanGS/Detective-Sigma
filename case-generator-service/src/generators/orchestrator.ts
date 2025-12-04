import { GenerationRequest, GeneratedCase, CaseFingerprint } from '../types';
import { createGeneratorLogger } from '../utils/logger';
import { generateStory } from './story';
import { generateSuspects } from './suspects';
import { generateClues } from './clues';
import { generatePuzzles } from './puzzles';
import { generateScenes } from './scenes';
import { generateAssets } from './assets';
import { calculateFingerprint } from '../validators/uniqueness';
import { validateQuality } from '../validators/quality';
import { nanoid } from 'nanoid';

const logger = createGeneratorLogger('orchestrator');

export async function orchestrateGeneration(
  request: GenerationRequest,
  onProgress: (progress: number) => void
): Promise<GeneratedCase> {
  const strategy = request.preferences?.strategy || 'hybrid';
  const caseId = `case-${nanoid(10)}`;

  logger.info({ caseId, strategy, request }, 'Starting case generation orchestration');

  try {
    // Step 1: Generate story foundation (10-25%)
    onProgress(10);
    logger.info('Generating story...');
    const story = await generateStory(request, strategy);
    onProgress(25);

    // Step 2: Generate suspects (25-40%)
    logger.info('Generating suspects...');
    const suspects = await generateSuspects(request, story, strategy);
    onProgress(40);

    // Step 3: Generate puzzles (40-55%)
    logger.info('Generating puzzles...');
    const puzzles = await generatePuzzles(request, story, strategy);
    onProgress(55);

    // Step 4: Generate clues (55-70%)
    logger.info('Generating clues...');
    const clues = await generateClues(request, story, suspects, puzzles, strategy);
    onProgress(70);

    // Step 5: Generate scenes (70-80%)
    logger.info('Generating scenes...');
    const scenes = await generateScenes(request, story, clues, strategy);
    onProgress(80);

    // Step 6: Calculate uniqueness fingerprint (80-85%)
    logger.info('Calculating uniqueness fingerprint...');
    const fingerprint = calculateFingerprint(story, suspects, puzzles, scenes);
    onProgress(85);

    // Step 7: Generate asset prompts (85-95%)
    logger.info('Generating asset specifications...');
    const assets = await generateAssets(request, story, suspects, clues, scenes);
    onProgress(95);

    // Step 8: Compile final case
    const generatedCase: GeneratedCase = {
      caseId,
      title: story.title,
      briefing: story.briefing,
      metadata: {
        difficulty: request.difficulty,
        gradeLevel: request.gradeLevel,
        subjectFocus: request.subject,
        estimatedMinutes: request.constraints?.estimatedMinutes || 45,
        uniquenessScore: 0, // Will be set after validation
        generationStrategy: strategy,
      },
      story: {
        setting: story.setting,
        crime: story.crime,
        resolution: story.resolution,
      },
      suspects,
      clues,
      puzzles,
      scenes,
      assets,
      fingerprint,
    };

    // Step 9: Validate quality (95-100%)
    logger.info('Validating case quality...');
    const validation = await validateQuality(generatedCase, request);
    
    if (!validation.isValid) {
      throw new Error(`Quality validation failed: ${validation.errors.join(', ')}`);
    }

    generatedCase.metadata.uniquenessScore = validation.uniquenessScore;
    onProgress(100);

    logger.info({ caseId, uniquenessScore: validation.uniquenessScore }, 'Case generation completed successfully');

    return generatedCase;
  } catch (error: any) {
    logger.error({ error: error.message, caseId }, 'Case generation failed');
    throw error;
  }
}
