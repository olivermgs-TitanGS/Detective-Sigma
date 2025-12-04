import OpenAI from 'openai';
import { AIAdapter, CompletionOptions, AIError } from './types';
import { config } from '../config';
import { createGeneratorLogger } from '../utils/logger';

const logger = createGeneratorLogger('ai-openai');

export class OpenAIAdapter implements AIAdapter {
  name = 'openai';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.ai.openai.apiKey,
    });
  }

  async generateCompletion(prompt: string, options: CompletionOptions = {}): Promise<string> {
    const model = options.model || config.ai.openai.model;
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 2000;

    logger.info({ model, temperature }, 'Generating completion with OpenAI');

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in detective cases for primary school students in Singapore. Always return valid JSON when requested.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new AIError('No content in response', 'openai');
      }

      logger.info({ tokensUsed: response.usage?.total_tokens }, 'Completion generated');

      return content;
    } catch (error: any) {
      logger.error({ error: error.message }, 'OpenAI API error');
      throw new AIError(`OpenAI API error: ${error.message}`, 'openai', error);
    }
  }
}
