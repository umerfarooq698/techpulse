import { AIProvider, AIGenerateOptions, AIGenerateResponse, ImageGenerateOptions, ImageGenerateResponse } from './base';
import { FallbackProvider } from './fallback';

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private fallbackEngine = new FallbackProvider();

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<AIGenerateResponse> {
    const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
    const preferredModel = options.model && options.model !== 'default-model' ? options.model : 'gemini-3-flash-preview';

    if (!apiKey) {
      console.warn('Gemini API key not found, using multi-topic fallback engine');
      return this.fallbackEngine.generateText(prompt, options);
    }

    const candidateModels = Array.from(new Set([
      preferredModel,
      'gemini-3-flash-preview',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite-preview',
      'gemini-flash-lite-latest',
      'gemma-4-31b-it',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro'
    ]));

    for (const model of candidateModels) {
      try {
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

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (generatedText.trim().length > 0) {
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
        }
      } catch (err) {
        console.warn(`Gemini API call failed for model ${model}:`, err);
      }
    }

    console.warn('All Gemini API endpoints failed or returned empty text. Using rich multi-topic engine fallback.');
    return this.fallbackEngine.generateText(prompt, options);
  }

  async generateImage(prompt: string, options: ImageGenerateOptions = {}): Promise<ImageGenerateResponse> {
    return this.fallbackEngine.generateImage(prompt, options);
  }
}

