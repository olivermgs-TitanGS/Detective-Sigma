import prisma from '../db/client';
import { logger } from '../utils/logger';
import { GenerationRequest } from '../types';

export async function createJob(jobId: string, request: GenerationRequest): Promise<void> {
  await prisma.generationJob.create({
    data: {
      jobId,
      request: request as any,
      status: 'PENDING',
      attempts: 0,
    },
  });
}

export async function updateJobStatus(
  jobId: string,
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
  data?: {
    progress?: number;
    caseId?: string;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
  }
): Promise<void> {
  await prisma.generationJob.update({
    where: { jobId },
    data: {
      status,
      ...data,
    },
  });
}

export async function incrementJobAttempts(jobId: string): Promise<void> {
  await prisma.generationJob.update({
    where: { jobId },
    data: {
      attempts: {
        increment: 1,
      },
    },
  });
}

export async function getJobStats(): Promise<{
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}> {
  const [pending, processing, completed, failed] = await Promise.all([
    prisma.generationJob.count({ where: { status: 'PENDING' } }),
    prisma.generationJob.count({ where: { status: 'PROCESSING' } }),
    prisma.generationJob.count({ where: { status: 'COMPLETED' } }),
    prisma.generationJob.count({ where: { status: 'FAILED' } }),
  ]);

  return { pending, processing, completed, failed };
}

export async function cleanupOldJobs(daysOld: number = 7): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.generationJob.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
      status: {
        in: ['COMPLETED', 'FAILED', 'CANCELLED'],
      },
    },
  });

  logger.info({ deleted: result.count, daysOld }, 'Cleaned up old generation jobs');

  return result.count;
}
