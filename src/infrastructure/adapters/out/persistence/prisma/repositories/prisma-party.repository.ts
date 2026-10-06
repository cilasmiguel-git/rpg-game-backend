import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreatePartyData,
  PartyRepositoryPort,
  UpdatePartyData,
} from '../../../../../../core/ports/out/party.repository.port';
import {
  DEFAULT_BATTLEMAP_STATE,
  PartyEntity,
  PartyStatus,
} from '../../../../../../core/domain/entities/party.entity';

@Injectable()
export class PrismaPartyRepository implements PartyRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: any): PartyEntity {
    return new PartyEntity(
      raw.id,
      raw.code,
      raw.title,
      raw.themeKey,
      raw.themeTitle,
      raw.masterId,
      raw.description ?? undefined,
      raw.password ?? undefined,
      raw.status as PartyStatus,
      raw.currentPhaseNumber,
      raw.battlemapState ?? DEFAULT_BATTLEMAP_STATE,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  async create(data: CreatePartyData): Promise<PartyEntity> {
    const party = await this.prisma.party.create({
      data: {
        code: data.code,
        title: data.title,
        description: data.description,
        themeKey: data.themeKey,
        themeTitle: data.themeTitle,
        masterId: data.masterId,
        password: data.password,
        battlemapState: (data.battlemapState ?? DEFAULT_BATTLEMAP_STATE) as any,
      },
    });
    return this.toDomain(party);
  }

  async findById(id: string): Promise<PartyEntity | null> {
    const party = await this.prisma.party.findUnique({ where: { id } });
    return party ? this.toDomain(party) : null;
  }

  async findByCode(code: string): Promise<PartyEntity | null> {
    const party = await this.prisma.party.findUnique({ where: { code } });
    return party ? this.toDomain(party) : null;
  }

  async listByMasterId(masterId: string): Promise<PartyEntity[]> {
    const parties = await this.prisma.party.findMany({
      where: { masterId },
      orderBy: { createdAt: 'desc' },
    });
    return parties.map((p) => this.toDomain(p));
  }

  async update(id: string, data: UpdatePartyData): Promise<PartyEntity> {
    const updatePayload: any = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.currentPhaseNumber !== undefined) updatePayload.currentPhaseNumber = data.currentPhaseNumber;
    if (data.battlemapState !== undefined) updatePayload.battlemapState = data.battlemapState;

    const updated = await this.prisma.party.update({
      where: { id },
      data: updatePayload,
    });
    return this.toDomain(updated);
  }
}
