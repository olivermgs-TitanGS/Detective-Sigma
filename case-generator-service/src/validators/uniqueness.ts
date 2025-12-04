import { CaseFingerprint, Suspect, Puzzle, Scene } from '../types';
import { StoryOutput } from '../generators/story';
import { createGeneratorLogger } from '../utils/logger';
import crypto from 'crypto';
import { checkFingerprintExists, findSimilarCases } from '../db/cases';

const logger = createGeneratorLogger('uniqueness');

export function calculateFingerprint(
  story: StoryOutput,
  suspects: Suspect[],
  puzzles: Puzzle[],
  scenes: Scene[]
): CaseFingerprint {
  logger.info('Calculating case fingerprint');

  // Structure hash: story elements
  const structureString = `${story.theme}|${story.location}|${story.crime}`;
  const structureHash = hashString(structureString);

  // Character hash: suspect names and roles
  const characterString = suspects
    .map((s) => `${s.name}|${s.role}|${s.isGuilty}`)
    .sort()
    .join('||');
  const characterHash = hashString(characterString);

  // Puzzle hash: puzzle types and questions
  const puzzleString = puzzles
    .map((p) => `${p.type}|${p.question}`)
    .sort()
    .join('||');
  const puzzleHash = hashString(puzzleString);

  // Location hash: scene names
  const locationString = scenes
    .map((s) => s.name)
    .sort()
    .join('|');
  const locationHash = hashString(locationString);

  // Combined hash
  const combinedString = `${structureHash}${characterHash}${puzzleHash}${locationHash}`;
  const combinedHash = hashString(combinedString);

  const fingerprint: CaseFingerprint = {
    structureHash,
    characterHash,
    puzzleHash,
    locationHash,
    combinedHash,
    timestamp: new Date(),
  };

  logger.info({ combinedHash }, 'Fingerprint calculated');

  return fingerprint;
}

export async function checkUniqueness(fingerprint: CaseFingerprint): Promise<{
  isUnique: boolean;
  similarCases: string[];
  similarityScore: number;
}> {
  logger.info({ combinedHash: fingerprint.combinedHash }, 'Checking uniqueness');

  // Check for exact match
  const exactMatch = await checkFingerprintExists(fingerprint.combinedHash);
  if (exactMatch) {
    logger.warn({ combinedHash: fingerprint.combinedHash }, 'Exact duplicate found');
    return {
      isUnique: false,
      similarCases: [],
      similarityScore: 1.0, // 100% match
    };
  }

  // Check for similar cases (2+ hash matches)
  const similarCaseIds = await findSimilarCases(
    fingerprint.structureHash,
    fingerprint.characterHash,
    fingerprint.puzzleHash
  );

  if (similarCaseIds.length > 0) {
    logger.warn({ similarCount: similarCaseIds.length }, 'Similar cases found');
    return {
      isUnique: false,
      similarCases: similarCaseIds,
      similarityScore: 0.75, // Estimated similarity
    };
  }

  logger.info('Case is unique');
  return {
    isUnique: true,
    similarCases: [],
    similarityScore: 0,
  };
}

function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
