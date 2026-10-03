import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreatePartyData,
  PartyRepositoryPort,
  UpdatePartyData,
} from '../../../../../../core/ports/out/party.repository.port';
import { PartyEntity, PartyStatus } from '../../../../../../core/domain/entities/party.entity';

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
    const updated = await this.prisma.party.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        currentPhaseNumber: data.currentPhaseNumber,
      },
    });
    return this.toDomain(updated);
  }
}
