import { AIProvider, AIGenerateOptions, AIGenerateResponse, ImageGenerateOptions, ImageGenerateResponse } from './base';

export class OpenAIProvider implements AIProvider {
  name = 'openai';

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<AIGenerateResponse> {
    const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    const model = options.model || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const messages = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
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
    const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        url: `/uploads/openai_${Date.now()}.webp`,
        alt: prompt.slice(0, 100),
        caption: `Visual representation of ${prompt.slice(0, 80)}`,
        width: 1200,
        height: 675,
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `High quality editorial technology illustration: ${prompt}. Professional, modern, vector tech graphics style, clean UI details.`,
          n: 1,
          size: '1024x1024',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data?.[0]?.url;
        if (imageUrl) {
          return {
            url: imageUrl,
            alt: prompt.slice(0, 100),
            caption: prompt.slice(0, 80),
            width: 1200,
            height: 675,
          };
        }
      }
    } catch (e) {
      // Fallback
    }

    return {
      url: `/uploads/tech_${Date.now()}.webp`,
      alt: prompt.slice(0, 100),
      caption: prompt.slice(0, 80),
      width: 1200,
      height: 675,
    };
  }
}
