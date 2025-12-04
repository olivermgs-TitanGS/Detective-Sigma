import { AIAdapter } from './types';
import { OpenAIAdapter } from './openai-adapter';
import { ClaudeAdapter } from './claude-adapter';
import { OllamaAdapter } from './ollama-adapter';
import { config } from '../config';

const adapters = new Map<string, AIAdapter>();

// Initialize adapters
if (config.ai.openai.apiKey) {
  adapters.set('openai', new OpenAIAdapter());
}

if (config.ai.claude.apiKey) {
  adapters.set('claude', new ClaudeAdapter());
}

if (config.ai.ollama.baseUrl) {
  adapters.set('ollama', new OllamaAdapter());
}

export function getAIAdapter(preferredProvider?: string): AIAdapter {
  if (preferredProvider && adapters.has(preferredProvider)) {
    return adapters.get(preferredProvider)!;
  }

  // Fallback order: OpenAI > Claude > Ollama
  if (adapters.has('openai')) return adapters.get('openai')!;
  if (adapters.has('claude')) return adapters.get('claude')!;
  if (adapters.has('ollama')) return adapters.get('ollama')!;

  throw new Error('No AI adapter available. Please configure at least one AI provider.');
}

export function getAvailableAdapters(): string[] {
  return Array.from(adapters.keys());
}
