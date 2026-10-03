import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CharacterRepositoryPort,
  CreateCharacterData,
  UpdateCharacterData,
} from '../../../../../../core/ports/out/character.repository.port';
import { CharacterEntity } from '../../../../../../core/domain/entities/character.entity';

@Injectable()
export class PrismaCharacterRepository implements CharacterRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: any): CharacterEntity {
    return new CharacterEntity(
      raw.id,
      raw.partyId,
      raw.playerName,
      raw.name,
      {
        sex: raw.sex,
        race: raw.race,
        skinColor: raw.skinColor,
        hairStyle: raw.hairStyle,
        hairColor: raw.hairColor,
        eyeColor: raw.eyeColor,
        bodyType: raw.bodyType,
        facialFeatures: raw.facialFeatures ?? undefined,
        outfitType: raw.outfitType,
        outfitPrimaryColor: raw.outfitPrimaryColor,
        outfitSecondaryColor: raw.outfitSecondaryColor ?? undefined,
        mainWeapon: raw.mainWeapon ?? undefined,
        headgear: raw.headgear ?? undefined,
        accessory: raw.accessory ?? undefined,
        avatarUrl: raw.avatarUrl ?? undefined,
      },
      {
        health: raw.health,
        maxHealth: raw.maxHealth,
        energy: raw.energy,
        bio: raw.bio ?? undefined,
      },
      raw.class ?? undefined,
      raw.userId ?? undefined,
      raw.isReady,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  async create(data: CreateCharacterData): Promise<CharacterEntity> {
    const char = await this.prisma.character.create({
      data: {
        partyId: data.partyId,
        userId: data.userId,
        playerName: data.playerName,
        name: data.name,
        class: data.characterClass,
        sex: data.appearance.sex,
        race: data.appearance.race,
        skinColor: data.appearance.skinColor,
        hairStyle: data.appearance.hairStyle,
        hairColor: data.appearance.hairColor,
        eyeColor: data.appearance.eyeColor,
        bodyType: data.appearance.bodyType,
        facialFeatures: data.appearance.facialFeatures,
        outfitType: data.appearance.outfitType,
        outfitPrimaryColor: data.appearance.outfitPrimaryColor,
        outfitSecondaryColor: data.appearance.outfitSecondaryColor,
        mainWeapon: data.appearance.mainWeapon,
        headgear: data.appearance.headgear,
        accessory: data.appearance.accessory,
        avatarUrl: data.appearance.avatarUrl,
        health: data.stats?.health ?? 100,
        maxHealth: data.stats?.maxHealth ?? 100,
        energy: data.stats?.energy ?? 50,
        bio: data.stats?.bio,
        isReady: data.isReady ?? false,
      },
    });
    return this.toDomain(char);
  }

  async findById(id: string): Promise<CharacterEntity | null> {
    const char = await this.prisma.character.findUnique({ where: { id } });
    return char ? this.toDomain(char) : null;
  }

  async listByPartyId(partyId: string): Promise<CharacterEntity[]> {
    const chars = await this.prisma.character.findMany({
      where: { partyId },
      orderBy: { createdAt: 'asc' },
    });
    return chars.map((c) => this.toDomain(c));
  }

  async update(id: string, data: UpdateCharacterData): Promise<CharacterEntity> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.characterClass !== undefined) updateData.class = data.characterClass;
    if (data.isReady !== undefined) updateData.isReady = data.isReady;

    if (data.appearance) {
      if (data.appearance.sex !== undefined) updateData.sex = data.appearance.sex;
      if (data.appearance.race !== undefined) updateData.race = data.appearance.race;
      if (data.appearance.skinColor !== undefined) updateData.skinColor = data.appearance.skinColor;
      if (data.appearance.hairStyle !== undefined) updateData.hairStyle = data.appearance.hairStyle;
      if (data.appearance.hairColor !== undefined) updateData.hairColor = data.appearance.hairColor;
      if (data.appearance.eyeColor !== undefined) updateData.eyeColor = data.appearance.eyeColor;
      if (data.appearance.bodyType !== undefined) updateData.bodyType = data.appearance.bodyType;
      if (data.appearance.facialFeatures !== undefined) updateData.facialFeatures = data.appearance.facialFeatures;
      if (data.appearance.outfitType !== undefined) updateData.outfitType = data.appearance.outfitType;
      if (data.appearance.outfitPrimaryColor !== undefined) updateData.outfitPrimaryColor = data.appearance.outfitPrimaryColor;
      if (data.appearance.outfitSecondaryColor !== undefined) updateData.outfitSecondaryColor = data.appearance.outfitSecondaryColor;
      if (data.appearance.mainWeapon !== undefined) updateData.mainWeapon = data.appearance.mainWeapon;
      if (data.appearance.headgear !== undefined) updateData.headgear = data.appearance.headgear;
      if (data.appearance.accessory !== undefined) updateData.accessory = data.appearance.accessory;
      if (data.appearance.avatarUrl !== undefined) updateData.avatarUrl = data.appearance.avatarUrl;
    }

    if (data.stats) {
      if (data.stats.health !== undefined) updateData.health = data.stats.health;
      if (data.stats.maxHealth !== undefined) updateData.maxHealth = data.stats.maxHealth;
      if (data.stats.energy !== undefined) updateData.energy = data.stats.energy;
      if (data.stats.bio !== undefined) updateData.bio = data.stats.bio;
    }

    const updated = await this.prisma.character.update({
      where: { id },
      data: updateData,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.character.delete({ where: { id } });
  }
}
