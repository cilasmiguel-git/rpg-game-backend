import { BattlemapState, PartyEntity, PartyStatus } from '../../domain/entities/party.entity';
import { CharacterEntity } from '../../domain/entities/character.entity';
import { PhaseEntity } from '../../domain/entities/phase.entity';

export interface CreatePartyCommand {
  masterId: string;
  title: string;
  themeKey: string;
  description?: string;
  password?: string;
}

export interface PartyLobbyDetails {
  party: PartyEntity;
  characters: CharacterEntity[];
  currentPhase?: PhaseEntity | null;
  inviteLink: string;
}

export interface SaveBattlemapResponse {
  success: boolean;
  message: string;
  battlemapState: BattlemapState;
  updatedAt: Date;
}

export interface PartyUseCasePort {
  createParty(command: CreatePartyCommand): Promise<{ party: PartyEntity; inviteLink: string }>;
  getPartyByCode(code: string): Promise<PartyLobbyDetails>;
  getPartyById(id: string): Promise<PartyLobbyDetails>;
  updateStatus(partyId: string, masterId: string, status: PartyStatus): Promise<PartyEntity>;
  listMasterParties(masterId: string): Promise<PartyEntity[]>;
  verifyPartyPassword(partyId: string, password?: string): Promise<boolean>;
  getBattlemapState(partyIdOrCode: string): Promise<BattlemapState>;
  updateBattlemapState(partyId: string, masterId: string, state: BattlemapState): Promise<SaveBattlemapResponse>;
}

export const PARTY_USE_CASE_PORT = Symbol('PartyUseCasePort');
