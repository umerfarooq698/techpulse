export interface AIGenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  systemPrompt?: string;
}

export interface ImageGenerateOptions {
  model?: string;
  apiKey?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export interface AIGenerateResponse {
  text: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ImageGenerateResponse {
  url: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: AIGenerateOptions): Promise<AIGenerateResponse>;
  generateImage(prompt: string, options?: ImageGenerateOptions): Promise<ImageGenerateResponse>;
}
