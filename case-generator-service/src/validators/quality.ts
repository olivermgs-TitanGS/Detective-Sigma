import { GeneratedCase, GenerationRequest, Suspect, Puzzle, Clue } from '../types';
import { createGeneratorLogger } from '../utils/logger';
import { checkUniqueness } from './uniqueness';
import { config } from '../config';

const logger = createGeneratorLogger('quality');

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  uniquenessScore: number;
}

export async function validateQuality(
  generatedCase: GeneratedCase,
  _request: GenerationRequest
): Promise<ValidationResult> {
  logger.info({ caseId: generatedCase.caseId }, 'Validating case quality');

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check uniqueness
  const uniquenessResult = await checkUniqueness(generatedCase.fingerprint);
  if (!uniquenessResult.isUnique) {
    if (uniquenessResult.similarityScore > 0.9) {
      errors.push(`Case too similar to existing cases: ${uniquenessResult.similarCases.join(', ')}`);
    } else if (uniquenessResult.similarityScore > 0.7) {
      warnings.push(`Case shares elements with: ${uniquenessResult.similarCases.join(', ')}`);
    }
  }

  // 2. Validate suspects
  if (generatedCase.suspects.length < 2) {
    errors.push('Must have at least 2 suspects');
  }
  const guiltyCount = generatedCase.suspects.filter((s: Suspect) => s.isGuilty).length;
  if (guiltyCount !== 1) {
    errors.push(`Must have exactly 1 guilty suspect (found ${guiltyCount})`);
  }

  // 3. Validate puzzles
  if (generatedCase.puzzles.length < 3) {
    errors.push('Must have at least 3 puzzles');
  }
  generatedCase.puzzles.forEach((puzzle: Puzzle) => {
    if (!puzzle.question || !puzzle.answer) {
      errors.push(`Puzzle ${puzzle.id} missing question or answer`);
    }
  });

  // 4. Validate clues
  const criticalClues = generatedCase.clues.filter((c: Clue) => c.relevance === 'critical');
  if (criticalClues.length < 2) {
    warnings.push('Should have at least 2 critical clues');
  }

  // 5. Validate scenes
  if (generatedCase.scenes.length < 2) {
    errors.push('Must have at least 2 scenes');
  }

  // 6. Check content appropriateness
  const inappropriateWords = ['violence', 'weapon', 'death', 'murder', 'kill'];
  const allText = `${generatedCase.title} ${generatedCase.briefing}`.toLowerCase();
  inappropriateWords.forEach((word) => {
    if (allText.includes(word)) {
      errors.push(`Content contains inappropriate word: ${word}`);
    }
  });

  // 7. Validate metadata
  if (!generatedCase.metadata.estimatedMinutes || generatedCase.metadata.estimatedMinutes < 15) {
    warnings.push('Estimated time should be at least 15 minutes');
  }

  const isValid = errors.length === 0;
  const uniquenessScore = uniquenessResult.isUnique ? 1.0 - uniquenessResult.similarityScore : 0;

  if (uniquenessScore < config.generation.minUniquenessScore) {
    errors.push(`Uniqueness score ${uniquenessScore.toFixed(2)} below threshold ${config.generation.minUniquenessScore}`);
  }

  logger.info(
    {
      caseId: generatedCase.caseId,
      isValid,
      errorsCount: errors.length,
      warningsCount: warnings.length,
      uniquenessScore,
    },
    'Validation completed'
  );

  return {
    isValid,
    errors,
    warnings,
    uniquenessScore,
  };
}
