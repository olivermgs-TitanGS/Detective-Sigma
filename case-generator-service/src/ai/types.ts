export interface AIAdapter {
  name: string;
  generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export class AIError extends Error {
  constructor(
    message: string,
    public provider: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AIError';
  }
}
