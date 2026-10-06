import { PhaseEntity } from '../../domain/entities/phase.entity';

export interface CreatePhaseCommand {
  partyId: string;
  masterId: string;
  title: string;
  masterNotes: string; // O que o mestre digitou livremente
  autoGenerateImage?: boolean;
}

export interface RegenerateAiNarrationCommand {
  phaseId: string;
  masterId: string;
  updatedMasterNotes?: string;
}

export interface PhaseUseCasePort {
  createPhase(command: CreatePhaseCommand): Promise<PhaseEntity>;
  regenerateAiNarration(command: RegenerateAiNarrationCommand): Promise<PhaseEntity>;
  generateSceneImage(phaseId: string, masterId: string): Promise<PhaseEntity>;
  publishPhase(phaseId: string, masterId: string): Promise<PhaseEntity>;
  getPhaseById(id: string): Promise<PhaseEntity>;
  listPhasesByParty(partyId: string): Promise<PhaseEntity[]>;
  getCurrentPhase(partyId: string): Promise<PhaseEntity | null>;
}

export const PHASE_USE_CASE_PORT = Symbol('PhaseUseCasePort');
