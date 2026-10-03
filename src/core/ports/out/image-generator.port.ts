export interface GenerateSceneImageInput {
  prompt: string;
  themeTitle: string;
  phaseNumber: number;
}

export interface GenerateSceneImageResult {
  imageUrl: string;
  revisedPrompt?: string;
}

export interface ImageGeneratorPort {
  generateSceneImage(input: GenerateSceneImageInput): Promise<GenerateSceneImageResult>;
}

export const IMAGE_GENERATOR_PORT = Symbol('ImageGeneratorPort');
