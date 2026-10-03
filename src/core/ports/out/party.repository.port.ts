import { PartyEntity, PartyStatus } from '../../domain/entities/party.entity';

export interface CreatePartyData {
  code: string;
  title: string;
  description?: string;
  themeKey: string;
  themeTitle: string;
  masterId: string;
  password?: string;
}

export interface UpdatePartyData {
  title?: string;
  description?: string;
  status?: PartyStatus;
  currentPhaseNumber?: number;
}

export interface PartyRepositoryPort {
  create(data: CreatePartyData): Promise<PartyEntity>;
  findById(id: string): Promise<PartyEntity | null>;
  findByCode(code: string): Promise<PartyEntity | null>;
  listByMasterId(masterId: string): Promise<PartyEntity[]>;
  update(id: string, data: UpdatePartyData): Promise<PartyEntity>;
}

export const PARTY_REPOSITORY_PORT = Symbol('PartyRepositoryPort');
