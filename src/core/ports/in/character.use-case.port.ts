import { CharacterAppearance, CharacterEntity, CharacterStats } from '../../domain/entities/character.entity';

export interface CreateCharacterCommand {
  partyId: string;
  userId?: string;
  playerName: string;
  name: string;
  characterClass?: string;
  appearance: CharacterAppearance;
  stats?: CharacterStats;
}

export interface UpdateCharacterCommand {
  characterId: string;
  requestingUserId?: string;
  name?: string;
  characterClass?: string;
  appearance?: Partial<CharacterAppearance>;
  stats?: Partial<CharacterStats>;
  isReady?: boolean;
}

export interface CharacterUseCasePort {
  createCharacter(command: CreateCharacterCommand): Promise<CharacterEntity>;
  getCharacterById(id: string): Promise<CharacterEntity>;
  listCharactersByParty(partyId: string): Promise<CharacterEntity[]>;
  updateCharacter(command: UpdateCharacterCommand): Promise<CharacterEntity>;
  deleteCharacter(characterId: string, requestingUserId?: string): Promise<void>;
  toggleReady(characterId: string): Promise<CharacterEntity>;
}

export const CHARACTER_USE_CASE_PORT = Symbol('CharacterUseCasePort');
