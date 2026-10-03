import {
  CharacterUseCasePort,
  CreateCharacterCommand,
  UpdateCharacterCommand,
} from '../../ports/in/character.use-case.port';
import { CharacterRepositoryPort } from '../../ports/out/character.repository.port';
import { PartyRepositoryPort } from '../../ports/out/party.repository.port';
import { CharacterEntity } from '../../domain/entities/character.entity';
import {
  EntityNotFoundException,
  InvalidOperationException,
} from '../../domain/exceptions/domain.exception';

export class CharacterService implements CharacterUseCasePort {
  constructor(
    private readonly characterRepo: CharacterRepositoryPort,
    private readonly partyRepo: PartyRepositoryPort,
  ) {}

  private generateDefaultAvatarUrl(appearance: any, characterName: string): string {
    // Gera URL de avatar estilizado (Dicebear lorelei/bottts/adventurer ou dynamic seed)
    const seed = encodeURIComponent(`${characterName}_${appearance.race}_${appearance.sex}_${appearance.hairStyle}`);
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&skinColor=${appearance.skinColor?.replace('#', '') || 'edb98a'}`;
  }

  async createCharacter(command: CreateCharacterCommand): Promise<CharacterEntity> {
    const party = await this.partyRepo.findById(command.partyId);
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', command.partyId);
    }

    if (!party.canJoin()) {
      throw new InvalidOperationException('Não é possível criar personagens em uma sessão finalizada.');
    }

    const avatarUrl = command.appearance.avatarUrl || this.generateDefaultAvatarUrl(command.appearance, command.name);

    const character = await this.characterRepo.create({
      partyId: command.partyId,
      userId: command.userId,
      playerName: command.playerName.trim(),
      name: command.name.trim(),
      characterClass: command.characterClass?.trim(),
      appearance: {
        ...command.appearance,
        avatarUrl,
      },
      stats: command.stats || { health: 100, maxHealth: 100, energy: 50 },
      isReady: false,
    });

    return character;
  }

  async getCharacterById(id: string): Promise<CharacterEntity> {
    const character = await this.characterRepo.findById(id);
    if (!character) {
      throw new EntityNotFoundException('Personagem', id);
    }
    return character;
  }

  async listCharactersByParty(partyId: string): Promise<CharacterEntity[]> {
    return this.characterRepo.listByPartyId(partyId);
  }

  async updateCharacter(command: UpdateCharacterCommand): Promise<CharacterEntity> {
    const character = await this.characterRepo.findById(command.characterId);
    if (!character) {
      throw new EntityNotFoundException('Personagem', command.characterId);
    }

    if (command.requestingUserId && character.userId && character.userId !== command.requestingUserId) {
      throw new InvalidOperationException('Você só pode editar o seu próprio personagem.');
    }

    const updated = await this.characterRepo.update(command.characterId, {
      name: command.name,
      characterClass: command.characterClass,
      appearance: command.appearance,
      stats: command.stats,
      isReady: command.isReady,
    });

    return updated;
  }

  async deleteCharacter(characterId: string, requestingUserId?: string): Promise<void> {
    const character = await this.characterRepo.findById(characterId);
    if (!character) {
      throw new EntityNotFoundException('Personagem', characterId);
    }

    if (requestingUserId && character.userId && character.userId !== requestingUserId) {
      throw new InvalidOperationException('Você só pode excluir seu próprio personagem.');
    }

    await this.characterRepo.delete(characterId);
  }

  async toggleReady(characterId: string): Promise<CharacterEntity> {
    const character = await this.characterRepo.findById(characterId);
    if (!character) {
      throw new EntityNotFoundException('Personagem', characterId);
    }

    return this.characterRepo.update(characterId, {
      isReady: !character.isReady,
    });
  }
}
