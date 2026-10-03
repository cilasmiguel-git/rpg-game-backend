export interface CharacterAppearance {
  sex: string;                  // 'MASCULINO' | 'FEMININO' | 'ANDROGINO' | 'OUTRO'
  race: string;                 // 'Humano', 'Elfo', 'Anão', 'Cyborg', 'Draconiano', etc.
  skinColor: string;            // HEX ou nome (ex: '#f5d0b0', 'bronze', 'obsidiana')
  hairStyle: string;            // 'careca', 'longo_liso', 'trancas', 'moicano', 'ondulado'
  hairColor: string;            // HEX ou nome (ex: '#1c1c1c', 'loiro_platinado', 'neon_blue')
  eyeColor: string;             // HEX ou nome (ex: '#2563eb', 'ambar', 'violeta', 'cibernetico_vermelho')
  bodyType: string;             // 'esguio', 'atletico', 'robusto', 'musculoso', 'pequeno'
  facialFeatures?: string;      // 'cicatriz no olho', 'barba viking', 'tatuagem runica facial'
  outfitType: string;           // 'armadura_placas', 'traje_couro', 'tunica_arcana', 'jaqueta_cyberpunk'
  outfitPrimaryColor: string;   // Cor predominante do vestuário
  outfitSecondaryColor?: string;// Cor secundária / detalhes
  mainWeapon?: string;          // 'Espada Longa', 'Arco Élfico', 'Rifle de Plasma', 'Cajado Rúnico'
  headgear?: string;            // 'Capuz Sombrio', 'Elmo com Chifres', 'Óculos de Realidade Aumentada'
  accessory?: string;           // 'Capa Longa', 'Amuleto Luminoso', 'Bandoleira com Granadas'
  avatarUrl?: string;           // Imagem de avatar renderizada ou preset visual
}

export interface CharacterStats {
  health?: number;
  maxHealth?: number;
  energy?: number;
  bio?: string;
}

export class CharacterEntity {
  constructor(
    public readonly id: string,
    public readonly partyId: string,
    public readonly playerName: string,
    public readonly name: string,
    public readonly appearance: CharacterAppearance,
    public readonly stats: CharacterStats = { health: 100, maxHealth: 100, energy: 50 },
    public readonly characterClass?: string,
    public readonly userId?: string,
    public readonly isReady: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
