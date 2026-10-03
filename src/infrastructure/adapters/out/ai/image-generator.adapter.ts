import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GenerateSceneImageInput,
  GenerateSceneImageResult,
  ImageGeneratorPort,
} from '../../../../core/ports/out/image-generator.port';

@Injectable()
export class ImageGeneratorAdapter implements ImageGeneratorPort {
  private readonly openAiKey?: string;
  private readonly imageModel: string;

  constructor(private readonly config: ConfigService) {
    this.openAiKey = this.config.get<string>('OPENAI_API_KEY');
    this.imageModel = this.config.get<string>('IMAGE_MODEL') || 'dall-e-3';
  }

  async generateSceneImage(input: GenerateSceneImageInput): Promise<GenerateSceneImageResult> {
    if (this.openAiKey && this.openAiKey.trim() !== '') {
      try {
        return await this.callOpenAiDallE(input);
      } catch (error: any) {
        console.warn('Erro ao gerar imagem via OpenAI DALL-E. Usando fallback gerador de arte RPG.', error?.message);
      }
    }

    return this.fallbackImageGenerator(input);
  }

  private async callOpenAiDallE(input: GenerateSceneImageInput): Promise<GenerateSceneImageResult> {
    const prompt = `RPG tabletop concept art, ${input.themeTitle} setting, phase ${input.phaseNumber}: ${input.prompt}. Cinematic lighting, high detailed digital painting.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openAiKey}`,
      },
      body: JSON.stringify({
        model: this.imageModel,
        prompt: prompt.slice(0, 1000),
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI DALL-E error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const imageUrl = data.data[0]?.url;

    return {
      imageUrl,
      revisedPrompt: data.data[0]?.revised_prompt,
    };
  }

  /**
   * Fallback visual que entrega imediatamente uma arte RPG gerada por IA compatível com a cena.
   */
  private fallbackImageGenerator(input: GenerateSceneImageInput): GenerateSceneImageResult {
    const cleanPrompt = encodeURIComponent(
      `masterpiece, best quality, rpg tabletop scene, ${input.themeTitle}, ${input.prompt.slice(0, 150)}, fantasy concept art, atmospheric lighting`,
    );
    // Pollinations AI gera ilustrações artísticas via URL direta sem custo
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=640&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

    return {
      imageUrl,
    };
  }
}
