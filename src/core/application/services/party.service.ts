import {
  CreatePartyCommand,
  PartyLobbyDetails,
  PartyUseCasePort,
  SaveBattlemapResponse,
} from '../../ports/in/party.use-case.port';
import { PartyRepositoryPort } from '../../ports/out/party.repository.port';
import { CharacterRepositoryPort } from '../../ports/out/character.repository.port';
import { PhaseRepositoryPort } from '../../ports/out/phase.repository.port';
import { ThemeUseCasePort } from '../../ports/in/theme.use-case.port';
import {
  BattlemapState,
  DEFAULT_BATTLEMAP_STATE,
  PartyEntity,
  PartyStatus,
} from '../../domain/entities/party.entity';
import {
  EntityNotFoundException,
  UnauthorizedPartyAccessException,
} from '../../domain/exceptions/domain.exception';

export class PartyService implements PartyUseCasePort {
  constructor(
    private readonly partyRepo: PartyRepositoryPort,
    private readonly characterRepo: CharacterRepositoryPort,
    private readonly phaseRepo: PhaseRepositoryPort,
    private readonly themeService: ThemeUseCasePort,
    private readonly frontendBaseUrl: string = 'http://localhost:5173',
  ) {}

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createParty(command: CreatePartyCommand): Promise<{ party: PartyEntity; inviteLink: string }> {
    const theme = await this.themeService.getThemeByKey(command.themeKey);

    let code = this.generateRoomCode();
    let existing = await this.partyRepo.findByCode(code);
    while (existing) {
      code = this.generateRoomCode();
      existing = await this.partyRepo.findByCode(code);
    }

    const party = await this.partyRepo.create({
      code,
      title: command.title.trim(),
      description: command.description?.trim(),
      themeKey: theme.key,
      themeTitle: theme.title,
      masterId: command.masterId,
      password: command.password ? command.password.trim() : undefined,
      battlemapState: DEFAULT_BATTLEMAP_STATE,
    });

    const inviteLink = `${this.frontendBaseUrl}/party/join/${party.code}`;

    return {
      party,
      inviteLink,
    };
  }

  async getPartyByCode(code: string): Promise<PartyLobbyDetails> {
    const party = await this.partyRepo.findByCode(code.toUpperCase().trim());
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', code);
    }

    return this.buildPartyDetails(party);
  }

  async getPartyById(id: string): Promise<PartyLobbyDetails> {
    const party = await this.partyRepo.findById(id);
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', id);
    }

    return this.buildPartyDetails(party);
  }

  private async buildPartyDetails(party: PartyEntity): Promise<PartyLobbyDetails> {
    const characters = await this.characterRepo.listByPartyId(party.id);
    const currentPhase = await this.phaseRepo.findByPartyAndNumber(party.id, party.currentPhaseNumber);

    return {
      party,
      characters,
      currentPhase,
      inviteLink: `${this.frontendBaseUrl}/party/join/${party.code}`,
    };
  }

  async updateStatus(partyId: string, masterId: string, status: PartyStatus): Promise<PartyEntity> {
    const party = await this.partyRepo.findById(partyId);
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', partyId);
    }

    if (!party.isMaster(masterId)) {
      throw new UnauthorizedPartyAccessException('Apenas o Mestre pode alterar o status da party.');
    }

    return this.partyRepo.update(partyId, { status });
  }

  async listMasterParties(masterId: string): Promise<PartyEntity[]> {
    return this.partyRepo.listByMasterId(masterId);
  }

  async verifyPartyPassword(partyId: string, password?: string): Promise<boolean> {
    const party = await this.partyRepo.findById(partyId);
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', partyId);
    }

    if (!party.password || party.password.trim() === '') {
      return true;
    }

    return party.password === password;
  }

  async getBattlemapState(partyIdOrCode: string): Promise<BattlemapState> {
    let party: PartyEntity | null = null;
    if (partyIdOrCode.length === 6) {
      party = await this.partyRepo.findByCode(partyIdOrCode.toUpperCase().trim());
    }
    if (!party) {
      party = await this.partyRepo.findById(partyIdOrCode);
    }
    if (!party) {
      party = await this.partyRepo.findByCode(partyIdOrCode.toUpperCase().trim());
    }

    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', partyIdOrCode);
    }

    return party.battlemapState ?? DEFAULT_BATTLEMAP_STATE;
  }

  async updateBattlemapState(
    partyId: string,
    masterId: string,
    state: BattlemapState,
  ): Promise<SaveBattlemapResponse> {
    const party = await this.partyRepo.findById(partyId);
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', partyId);
    }

    if (!party.isMaster(masterId)) {
      throw new UnauthorizedPartyAccessException('Apenas o Mestre pode alterar o estado do Battlemap.');
    }

    const updated = await this.partyRepo.update(partyId, { battlemapState: state });

    return {
      success: true,
      message: 'Estado do Battlemap salvo com sucesso!',
      battlemapState: updated.battlemapState ?? DEFAULT_BATTLEMAP_STATE,
      updatedAt: updated.updatedAt ?? new Date(),
    };
  }
}
