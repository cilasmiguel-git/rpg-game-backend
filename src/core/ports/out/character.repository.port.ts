import { CharacterAppearance, CharacterEntity, CharacterStats } from '../../domain/entities/character.entity';

export interface CreateCharacterData {
  partyId: string;
  userId?: string;
  playerName: string;
  name: string;
  characterClass?: string;
  appearance: CharacterAppearance;
  stats?: CharacterStats;
  isReady?: boolean;
}

export interface UpdateCharacterData {
  name?: string;
  characterClass?: string;
  appearance?: Partial<CharacterAppearance>;
  stats?: Partial<CharacterStats>;
  isReady?: boolean;
}

export interface CharacterRepositoryPort {
  create(data: CreateCharacterData): Promise<CharacterEntity>;
  findById(id: string): Promise<CharacterEntity | null>;
  listByPartyId(partyId: string): Promise<CharacterEntity[]>;
  update(id: string, data: UpdateCharacterData): Promise<CharacterEntity>;
  delete(id: string): Promise<void>;
}

export const CHARACTER_REPOSITORY_PORT = Symbol('CharacterRepositoryPort');
