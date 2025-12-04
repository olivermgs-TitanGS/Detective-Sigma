import Anthropic from '@anthropic-ai/sdk';
import { AIAdapter, CompletionOptions, AIError } from './types';
import { config } from '../config';
import { createGeneratorLogger } from '../utils/logger';

const logger = createGeneratorLogger('ai-claude');

export class ClaudeAdapter implements AIAdapter {
  name = 'claude';
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ai.claude.apiKey,
    });
  }

  async generateCompletion(prompt: string, options: CompletionOptions = {}): Promise<string> {
    const model = options.model || config.ai.claude.model;
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 2000;

    logger.info({ model, temperature }, 'Generating completion with Claude');

    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: 'You are an expert educational content creator specializing in detective cases for primary school students in Singapore. Always return valid JSON when requested.',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new AIError('Unexpected response type', 'claude');
      }

      logger.info({ tokensUsed: response.usage.input_tokens + response.usage.output_tokens }, 'Completion generated');

      return content.text;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Claude API error');
      throw new AIError(`Claude API error: ${error.message}`, 'claude', error);
    }
  }
}
