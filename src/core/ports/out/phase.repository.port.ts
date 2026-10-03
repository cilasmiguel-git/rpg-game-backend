import { PhaseEntity, PhaseStatus } from '../../domain/entities/phase.entity';

export interface CreatePhaseData {
  partyId: string;
  phaseNumber: number;
  title: string;
  masterNotes: string;
  formattedNarration: string;
  aiAtmosphere?: string;
  imagePrompt?: string;
  imageUrl?: string;
  suggestedHooks?: string[];
  status?: PhaseStatus;
}

export interface UpdatePhaseData {
  title?: string;
  masterNotes?: string;
  formattedNarration?: string;
  aiAtmosphere?: string;
  imagePrompt?: string;
  imageUrl?: string;
  suggestedHooks?: string[];
  status?: PhaseStatus;
}

export interface PhaseRepositoryPort {
  create(data: CreatePhaseData): Promise<PhaseEntity>;
  findById(id: string): Promise<PhaseEntity | null>;
  findByPartyAndNumber(partyId: string, phaseNumber: number): Promise<PhaseEntity | null>;
  listByPartyId(partyId: string): Promise<PhaseEntity[]>;
  update(id: string, data: UpdatePhaseData): Promise<PhaseEntity>;
}

export const PHASE_REPOSITORY_PORT = Symbol('PhaseRepositoryPort');
