import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreatePhaseData,
  PhaseRepositoryPort,
  UpdatePhaseData,
} from '../../../../../../core/ports/out/phase.repository.port';
import { PhaseEntity, PhaseStatus } from '../../../../../../core/domain/entities/phase.entity';

@Injectable()
export class PrismaPhaseRepository implements PhaseRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: any): PhaseEntity {
    return new PhaseEntity(
      raw.id,
      raw.partyId,
      raw.phaseNumber,
      raw.title,
      raw.masterNotes,
      raw.formattedNarration,
      raw.aiAtmosphere ?? undefined,
      raw.imagePrompt ?? undefined,
      raw.imageUrl ?? undefined,
      raw.suggestedHooks ?? [],
      raw.status as PhaseStatus,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  async create(data: CreatePhaseData): Promise<PhaseEntity> {
    const phase = await this.prisma.phase.create({
      data: {
        partyId: data.partyId,
        phaseNumber: data.phaseNumber,
        title: data.title,
        masterNotes: data.masterNotes,
        formattedNarration: data.formattedNarration,
        aiAtmosphere: data.aiAtmosphere,
        imagePrompt: data.imagePrompt,
        imageUrl: data.imageUrl,
        suggestedHooks: data.suggestedHooks ?? [],
        status: data.status ?? 'PUBLISHED',
      },
    });
    return this.toDomain(phase);
  }

  async findById(id: string): Promise<PhaseEntity | null> {
    const phase = await this.prisma.phase.findUnique({ where: { id } });
    return phase ? this.toDomain(phase) : null;
  }

  async findByPartyAndNumber(partyId: string, phaseNumber: number): Promise<PhaseEntity | null> {
    const phase = await this.prisma.phase.findFirst({
      where: { partyId, phaseNumber },
    });
    return phase ? this.toDomain(phase) : null;
  }

  async listByPartyId(partyId: string): Promise<PhaseEntity[]> {
    const phases = await this.prisma.phase.findMany({
      where: { partyId },
      orderBy: { phaseNumber: 'asc' },
    });
    return phases.map((p) => this.toDomain(p));
  }

  async update(id: string, data: UpdatePhaseData): Promise<PhaseEntity> {
    const updated = await this.prisma.phase.update({
      where: { id },
      data: {
        title: data.title,
        masterNotes: data.masterNotes,
        formattedNarration: data.formattedNarration,
        aiAtmosphere: data.aiAtmosphere,
        imagePrompt: data.imagePrompt,
        imageUrl: data.imageUrl,
        suggestedHooks: data.suggestedHooks,
        status: data.status,
      },
    });
    return this.toDomain(updated);
  }
}
