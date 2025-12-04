import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { GenerationRequestSchema, GenerationRequest } from '../types';
import { generateQueue } from '../queue';
import { v4 as uuidv4 } from 'uuid';
import { createJob } from '../db/jobs';
import { getCaseById } from '../db/cases';

export async function registerRoutes(fastify: FastifyInstance) {
  // POST /api/generate - Request new case generation
  fastify.post('/api/generate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validationResult = GenerationRequestSchema.safeParse(request.body);
      
      if (!validationResult.success) {
        return reply.code(400).send({
          error: 'Invalid request',
          details: validationResult.error.errors,
        });
      }

      const generationRequest: GenerationRequest = validationResult.data;
      const jobId = uuidv4();

      // Create job record in database
      await createJob(jobId, generationRequest);

      // Add job to queue
      await generateQueue.add('generate-case', {
        jobId,
        request: generationRequest,
        createdAt: new Date().toISOString(),
      }, {
        jobId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        timeout: 300000, // 5 minutes
      });

      return reply.code(202).send({
        jobId,
        status: 'pending',
        message: 'Case generation started',
        estimatedTime: generationRequest.preferences?.strategy === 'template' ? 45 : 
                       generationRequest.preferences?.strategy === 'ai' ? 180 : 120,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error', message: error.message });
    }
  });

  // GET /api/status/:jobId - Check generation status
  fastify.get('/api/status/:jobId', async (request: FastifyRequest<{ Params: { jobId: string } }>, reply: FastifyReply) => {
    try {
      const { jobId } = request.params;
      const job = await generateQueue.getJob(jobId);

      if (!job) {
        return reply.code(404).send({ error: 'Job not found' });
      }

      const state = await job.getState();
      const progress = job.progress;
      const result = job.returnvalue;
      const failedReason = job.failedReason;

      return reply.send({
        jobId,
        status: state,
        progress,
        result: state === 'completed' ? result : null,
        error: state === 'failed' ? failedReason : null,
        startedAt: job.timestamp,
        finishedAt: job.finishedOn || null,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error', message: error.message });
    }
  });

  // GET /api/case/:caseId - Retrieve generated case
  fastify.get('/api/case/:caseId', async (request: FastifyRequest<{ Params: { caseId: string } }>, reply: FastifyReply) => {
    try {
      const { caseId } = request.params;
      
      const generatedCase = await getCaseById(caseId);
      
      if (!generatedCase) {
        return reply.code(404).send({ error: 'Case not found' });
      }

      return reply.send(generatedCase);
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error', message: error.message });
    }
  });

  // POST /api/validate - Validate case uniqueness before saving
  fastify.post('/api/validate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { fingerprint } = request.body as { fingerprint: any };

      if (!fingerprint || !fingerprint.combinedHash) {
        return reply.code(400).send({ error: 'Invalid fingerprint' });
      }

      // TODO: Check uniqueness against database
      // For now, return placeholder
      return reply.send({
        isUnique: true,
        similarCases: [],
        uniquenessScore: 1.0,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error', message: error.message });
    }
  });

  // DELETE /api/job/:jobId - Cancel a pending/processing job
  fastify.delete('/api/job/:jobId', async (request: FastifyRequest<{ Params: { jobId: string } }>, reply: FastifyReply) => {
    try {
      const { jobId } = request.params;
      const job = await generateQueue.getJob(jobId);

      if (!job) {
        return reply.code(404).send({ error: 'Job not found' });
      }

      const state = await job.getState();
      
      if (state === 'completed' || state === 'failed') {
        return reply.code(400).send({ error: `Cannot cancel ${state} job` });
      }

      await job.remove();

      return reply.send({
        jobId,
        message: 'Job cancelled successfully',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error', message: error.message });
    }
  });

  // GET /api/stats - Get generation statistics
  fastify.get('/api/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        generateQueue.getWaitingCount(),
        generateQueue.getActiveCount(),
        generateQueue.getCompletedCount(),
        generateQueue.getFailedCount(),
      ]);

      return reply.send({
        queue: {
          waiting,
          active,
          completed,
          failed,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error', message: error.message });
    }
  });
}
