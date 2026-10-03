export interface EnhanceLoreInput {
  themeTitle: string;
  themePromptTone?: string;
  phaseNumber: number;
  masterNotes: string;
  charactersPresent?: Array<{ name: string; race: string; class?: string }>;
  previousPhaseSummary?: string;
}

export interface EnhanceLoreResult {
  formattedNarration: string;
  aiAtmosphere: string;
  imagePrompt: string;
  suggestedHooks: string[];
}

export interface AiLoreEnhancerPort {
  enhanceMasterNotes(input: EnhanceLoreInput): Promise<EnhanceLoreResult>;
}

export const AI_LORE_ENHANCER_PORT = Symbol('AiLoreEnhancerPort');
