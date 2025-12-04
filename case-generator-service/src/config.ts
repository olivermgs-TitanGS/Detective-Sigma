import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Service
  port: parseInt(process.env.PORT || '4000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  apiSecret: process.env.API_SECRET || 'development-secret',

  // Database
  database: {
    url: process.env.DATABASE_URL || '',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // AI Providers
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    },
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    },
    ollama: {
      baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama2',
    },
  },

  // ComfyUI
  comfyui: {
    apiUrl: process.env.COMFYUI_API_URL || 'http://localhost:8188',
  },

  // Generation
  generation: {
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_GENERATIONS || '5'),
    timeoutMs: parseInt(process.env.GENERATION_TIMEOUT_MS || '300000'),
    cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '3600'),
    maxRetries: parseInt(process.env.MAX_GENERATION_RETRIES || '3'),
    minUniquenessScore: parseFloat(process.env.MIN_UNIQUENESS_SCORE || '0.85'),
  },

};
