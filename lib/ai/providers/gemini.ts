import { AIProvider, AIGenerateOptions, AIGenerateResponse, ImageGenerateOptions, ImageGenerateResponse } from './base';

export class GeminiProvider implements AIProvider {
  name = 'gemini';

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<AIGenerateResponse> {
    const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
    const model = options.model || 'gemini-1.5-flash';

    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = [];
    if (options.systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: `System Instruction: ${options.systemPrompt}` }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood.' }] });
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 4000,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const totalTokens = data.usageMetadata?.totalTokenCount || 0;

    return {
      text: generatedText,
      tokenUsage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens,
      },
    };
  }

  async generateImage(prompt: string, options: ImageGenerateOptions = {}): Promise<ImageGenerateResponse> {
    // Standard image generation payload fallback or Imagen endpoint
    return {
      url: `/uploads/tech_${Date.now()}.webp`,
      alt: prompt.slice(0, 100),
      caption: `Editorial visual representation of ${prompt.slice(0, 80)}`,
      width: 1200,
      height: 675,
    };
  }
}
