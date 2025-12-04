import Queue from 'bull';
import { config } from './config';
import { logger, createJobLogger } from './utils/logger';
import { GenerationRequest, GeneratedCase } from './types';
import { orchestrateGeneration } from './generators/orchestrator';
import { updateJobStatus, incrementJobAttempts } from './db/jobs';
import { saveGeneratedCase } from './db/cases';

export const generateQueue = new Queue('case-generation', config.redis.url, {
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
  limiter: {
    max: config.generation.maxConcurrent,
    duration: 60000, // 1 minute
  },
});

// Process case generation jobs
generateQueue.process('generate-case', config.generation.maxConcurrent, async (job) => {
  const jobLogger = createJobLogger(job.id.toString());
  const { jobId, request } = job.data as { jobId: string; request: GenerationRequest; createdAt: string };

  jobLogger.info({ request }, 'Starting case generation');

  try {
    // Update job status to PROCESSING
    await updateJobStatus(jobId, 'PROCESSING', {
      progress: 5,
      startedAt: new Date(),
    });
    await incrementJobAttempts(jobId);

    // Update progress: Starting
    job.progress(5);

    // Orchestrate generation process
    const generatedCase = await orchestrateGeneration(request, async (progress) => {
      job.progress(progress);
      // Update DB progress periodically
      if (progress % 20 === 0) {
        await updateJobStatus(jobId, 'PROCESSING', { progress });
      }
    });

    jobLogger.info({ caseId: generatedCase.caseId }, 'Case generation completed');

    // Save generated case to database
    await saveGeneratedCase(generatedCase);

    // Update job status to COMPLETED
    await updateJobStatus(jobId, 'COMPLETED', {
      progress: 100,
      caseId: generatedCase.caseId,
      completedAt: new Date(),
    });

    // Update progress: Complete
    job.progress(100);

    return generatedCase;
  } catch (error: any) {
    jobLogger.error({ error: error.message, stack: error.stack }, 'Case generation failed');
    
    // Update job status to FAILED
    await updateJobStatus(jobId, 'FAILED', {
      error: error.message,
      completedAt: new Date(),
    });

    throw error;
  }
});

// Event handlers
generateQueue.on('completed', (job, result: GeneratedCase) => {
  logger.info(
    { jobId: job.id, caseId: result.caseId, duration: Date.now() - job.timestamp },
    'Job completed'
  );
});

generateQueue.on('failed', (job, error) => {
  logger.error(
    { jobId: job.id, error: error.message, attempts: job.attemptsMade },
    'Job failed'
  );
});

generateQueue.on('stalled', (job) => {
  logger.warn({ jobId: job.id }, 'Job stalled');
});

generateQueue.on('error', (error) => {
  logger.error({ error: error.message }, 'Queue error');
});

// Graceful shutdown
export async function closeQueue() {
  logger.info('Closing generation queue...');
  await generateQueue.close();
  logger.info('Queue closed');
}
