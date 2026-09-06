import { AIProvider, AIGenerateOptions, AIGenerateResponse, ImageGenerateOptions, ImageGenerateResponse } from './base';

export class OpenRouterProvider implements AIProvider {
  name = 'openrouter';

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<AIGenerateResponse> {
    const apiKey = options.apiKey || process.env.OPENROUTER_API_KEY;
    const model = options.model || 'anthropic/claude-3.5-sonnet';

    if (!apiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    const messages = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content || '',
      tokenUsage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }

  async generateImage(prompt: string, options: ImageGenerateOptions = {}): Promise<ImageGenerateResponse> {
    return {
      url: `/uploads/openrouter_${Date.now()}.webp`,
      alt: prompt.slice(0, 100),
      caption: prompt.slice(0, 80),
      width: 1200,
      height: 675,
    };
  }
}
