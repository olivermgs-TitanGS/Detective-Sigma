import prisma from '../db/client';
import { GeneratedCase } from '../types';
import { logger } from '../utils/logger';

export async function saveGeneratedCase(generatedCase: GeneratedCase): Promise<void> {
  logger.info({ caseId: generatedCase.caseId }, 'Saving generated case to database');

  try {
    await prisma.generatedCase.create({
      data: {
        caseId: generatedCase.caseId,
        title: generatedCase.title,
        briefing: generatedCase.briefing,
        metadata: generatedCase.metadata as any,
        story: generatedCase.story as any,
        suspects: generatedCase.suspects as any,
        clues: generatedCase.clues as any,
        puzzles: generatedCase.puzzles as any,
        scenes: generatedCase.scenes as any,
        assets: generatedCase.assets as any,
        strategy: generatedCase.metadata.generationStrategy,
        status: 'DRAFT',
        fingerprint: {
          create: {
            structureHash: generatedCase.fingerprint.structureHash,
            characterHash: generatedCase.fingerprint.characterHash,
            puzzleHash: generatedCase.fingerprint.puzzleHash,
            locationHash: generatedCase.fingerprint.locationHash,
            combinedHash: generatedCase.fingerprint.combinedHash,
          },
        },
      },
    });

    logger.info({ caseId: generatedCase.caseId }, 'Case saved successfully');
  } catch (error: any) {
    logger.error({ error: error.message, caseId: generatedCase.caseId }, 'Failed to save case');
    throw error;
  }
}

export async function getCaseById(caseId: string): Promise<GeneratedCase | null> {
  const dbCase = await prisma.generatedCase.findUnique({
    where: { caseId },
    include: { fingerprint: true },
  });

  if (!dbCase) return null;

  // Convert from DB format to GeneratedCase type
  return {
    caseId: dbCase.caseId,
    title: dbCase.title,
    briefing: dbCase.briefing,
    metadata: dbCase.metadata as any,
    story: dbCase.story as any,
    suspects: dbCase.suspects as any,
    clues: dbCase.clues as any,
    puzzles: dbCase.puzzles as any,
    scenes: dbCase.scenes as any,
    assets: dbCase.assets as any,
    fingerprint: {
      structureHash: dbCase.fingerprint!.structureHash,
      characterHash: dbCase.fingerprint!.characterHash,
      puzzleHash: dbCase.fingerprint!.puzzleHash,
      locationHash: dbCase.fingerprint!.locationHash,
      combinedHash: dbCase.fingerprint!.combinedHash,
      timestamp: dbCase.fingerprint!.createdAt,
    },
  };
}

export async function checkFingerprintExists(combinedHash: string): Promise<boolean> {
  const existing = await prisma.caseFingerprint.findUnique({
    where: { combinedHash },
  });
  return !!existing;
}

export async function findSimilarCases(
  structureHash: string,
  characterHash: string,
  puzzleHash: string
): Promise<string[]> {
  // Find cases that share at least 2 of 3 main hashes
  const similar = await prisma.caseFingerprint.findMany({
    where: {
      OR: [
        { structureHash },
        { characterHash },
        { puzzleHash },
      ],
    },
    select: {
      caseId: true,
      structureHash: true,
      characterHash: true,
      puzzleHash: true,
    },
  });

  // Calculate similarity scores
  const similarCases = similar
    .map((fp) => {
      let matches = 0;
      if (fp.structureHash === structureHash) matches++;
      if (fp.characterHash === characterHash) matches++;
      if (fp.puzzleHash === puzzleHash) matches++;
      return { caseId: fp.caseId, matches };
    })
    .filter((s) => s.matches >= 2) // At least 2 matches = similar
    .map((s) => s.caseId);

  return similarCases;
}
