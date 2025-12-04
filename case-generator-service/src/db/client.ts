import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Log Prisma errors
prisma.$on('warn', (e) => {
  logger.warn({ prisma: e }, 'Prisma warning');
});

prisma.$on('error', (e) => {
  logger.error({ prisma: e }, 'Prisma error');
});

export default prisma;
