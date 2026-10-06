export type PartyStatus = 'LOBBY' | 'IN_PROGRESS' | 'FINISHED';

export interface SpriteAnimationConfig {
  isAnimated: boolean;
  frames: number;
  orientation: 'horizontal' | 'vertical';
  duration?: string;
}

export interface PlacedAsset {
  id: string;
  assetId: string;
  name: string;
  imageUrl: string;
  gridX: number;
  gridY: number;
  widthTiles: number;
  heightTiles: number;
  rotation: number;
  opacity: number;
  isObstacle: boolean;
  layer: 'under' | 'over';
  animation?: SpriteAnimationConfig;
}

export interface GridToken {
  id: string;
  name: string;
  type: 'player' | 'monster' | 'npc';
  avatar: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  size: number;
  color: string;
}

export interface BattlemapState {
  gridSize: number;
  terrain: Record<string, string>;
  placedAssets: PlacedAsset[];
  tokens: GridToken[];
}

export const DEFAULT_BATTLEMAP_STATE: BattlemapState = {
  gridSize: 18,
  terrain: {},
  placedAssets: [],
  tokens: [],
};

export class PartyEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly title: string,
    public readonly themeKey: string,
    public readonly themeTitle: string,
    public readonly masterId: string,
    public readonly description?: string,
    public readonly password?: string,
    public readonly status: PartyStatus = 'LOBBY',
    public readonly currentPhaseNumber: number = 1,
    public readonly battlemapState: BattlemapState = DEFAULT_BATTLEMAP_STATE,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  canJoin(): boolean {
    return this.status !== 'FINISHED';
  }

  isMaster(userId: string): boolean {
    return this.masterId === userId;
  }
}

