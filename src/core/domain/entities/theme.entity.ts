export interface ThemeOption {
  id: string;
  name: string;
  description?: string;
  previewColor?: string;
}

export class ThemeEntity {
  constructor(
    public readonly key: string,
    public readonly title: string,
    public readonly description: string,
    public readonly genre: string,
    public readonly races: ThemeOption[],
    public readonly hairStyles: ThemeOption[],
    public readonly bodyTypes: ThemeOption[],
    public readonly outfitTypes: ThemeOption[],
    public readonly mainWeapons: ThemeOption[],
    public readonly headgears: ThemeOption[],
    public readonly accessories: ThemeOption[],
    public readonly skinPalettes: string[],
    public readonly hairPalettes: string[],
    public readonly clothingPalettes: string[],
    public readonly aiPromptTone: string,
  ) {}
}
