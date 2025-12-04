import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { registerRoutes } from './api/routes';
import { closeQueue } from './queue';
import { logger } from './utils/logger';

const fastify = Fastify({
  logger: logger as any,
});

// Register plugins
fastify.register(cors, {
  origin: true,
  credentials: true,
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});

// Health check endpoint
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    service: 'detective-sigma-case-generator',
    version: '1.0.0',
    timestamp: new Date().toISOString() 
  };
});

// Register API routes
fastify.register(registerRoutes);

// Graceful shutdown
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await closeQueue();
    await fastify.close();
    process.exit(0);
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    logger.info(`🚀 Case Generator Service running on port ${config.port}`);
    logger.info(`📡 API: http://localhost:${config.port}/api`);
    logger.info(`❤️  Health: http://localhost:${config.port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
