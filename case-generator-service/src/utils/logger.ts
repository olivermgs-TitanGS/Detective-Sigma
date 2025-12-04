import pino from 'pino';
import { config } from '../config';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: config.logLevel || 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function createJobLogger(jobId: string) {
  return logger.child({ jobId });
}

export function createGeneratorLogger(type: string) {
  return logger.child({ generator: type });
}
