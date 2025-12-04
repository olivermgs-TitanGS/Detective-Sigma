import axios from 'axios';
import { AIAdapter, CompletionOptions, AIError } from './types';
import { config } from '../config';
import { createGeneratorLogger } from '../utils/logger';

const logger = createGeneratorLogger('ai-ollama');

export class OllamaAdapter implements AIAdapter {
  name = 'ollama';
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.ai.ollama.baseUrl;
  }

  async generateCompletion(prompt: string, options: CompletionOptions = {}): Promise<string> {
    const model = options.model || config.ai.ollama.model;
    const temperature = options.temperature ?? 0.7;

    logger.info({ model, temperature, baseUrl: this.baseUrl }, 'Generating completion with Ollama');

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model,
          prompt: `You are an expert educational content creator specializing in detective cases for primary school students in Singapore. Always return valid JSON when requested.\n\n${prompt}`,
          stream: false,
          options: {
            temperature,
          },
        },
        {
          timeout: 60000, // 60 seconds
        }
      );

      const content = response.data.response;
      if (!content) {
        throw new AIError('No content in response', 'ollama');
      }

      logger.info('Completion generated with Ollama');

      return content;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Ollama API error');
      throw new AIError(`Ollama API error: ${error.message}`, 'ollama', error);
    }
  }
}
