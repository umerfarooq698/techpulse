import { db } from '@/lib/db';
import { AIProvider } from './providers/base';
import { GeminiProvider } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { OpenRouterProvider } from './providers/openrouter';
import { FallbackProvider } from './providers/fallback';

export async function getAIProvider(overrideProviderName?: string): Promise<{ provider: AIProvider; apiKey?: string; model?: string; temperature?: number; maxTokens?: number }> {
  try {
    const settings = await db.aISetting.findFirst();
    const providerName = overrideProviderName || settings?.provider || 'fallback';
    const apiKey = settings?.apiKey || '';
    const model = settings?.model || 'default-model';
    const temperature = settings?.temperature ?? 0.7;
    const maxTokens = settings?.maxTokens ?? 4000;

    switch (providerName.toLowerCase()) {
      case 'gemini':
        if (apiKey || process.env.GEMINI_API_KEY) {
          return { provider: new GeminiProvider(), apiKey: apiKey || process.env.GEMINI_API_KEY, model, temperature, maxTokens };
        }
        break;
      case 'openai':
        if (apiKey || process.env.OPENAI_API_KEY) {
          return { provider: new OpenAIProvider(), apiKey: apiKey || process.env.OPENAI_API_KEY, model, temperature, maxTokens };
        }
        break;
      case 'anthropic':
        if (apiKey || process.env.ANTHROPIC_API_KEY) {
          return { provider: new AnthropicProvider(), apiKey: apiKey || process.env.ANTHROPIC_API_KEY, model, temperature, maxTokens };
        }
        break;
      case 'openrouter':
        if (apiKey || process.env.OPENROUTER_API_KEY) {
          return { provider: new OpenRouterProvider(), apiKey: apiKey || process.env.OPENROUTER_API_KEY, model, temperature, maxTokens };
        }
        break;
    }
  } catch (err) {
    console.warn('Database AI settings lookup failed, using fallback engine:', err);
  }

  // Default fallback engine if no keys exist or fallback specified
  return { provider: new FallbackProvider() };
}
