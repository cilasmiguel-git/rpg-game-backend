import { PartyService } from './party.service';
import { PartyRepositoryPort } from '../../ports/out/party.repository.port';
import { CharacterRepositoryPort } from '../../ports/out/character.repository.port';
import { PhaseRepositoryPort } from '../../ports/out/phase.repository.port';
import { ThemeUseCasePort } from '../../ports/in/theme.use-case.port';
import {
  DEFAULT_BATTLEMAP_STATE,
  PartyEntity,
} from '../../domain/entities/party.entity';
import {
  EntityNotFoundException,
  UnauthorizedPartyAccessException,
} from '../../domain/exceptions/domain.exception';

describe('PartyService - Battlemap persistence', () => {
  let partyService: PartyService;
  let partyRepo: jest.Mocked<PartyRepositoryPort>;
  let characterRepo: jest.Mocked<CharacterRepositoryPort>;
  let phaseRepo: jest.Mocked<PhaseRepositoryPort>;
  let themeService: jest.Mocked<ThemeUseCasePort>;

  const mockParty = new PartyEntity(
    'party123',
    'ABCDEF',
    'Mina Perdida',
    'fantasia_medieval',
    'Fantasia Medieval',
    'master123',
    'Descrição',
    undefined,
    'LOBBY',
    1,
    {
      gridSize: 18,
      terrain: { '0-0': 'grass' },
      placedAssets: [
        {
          id: 'placed_1',
          assetId: 'ts_bld_castle_knights',
          name: 'Castelo',
          imageUrl: '/assets/castle.png',
          gridX: 2,
          gridY: 2,
          widthTiles: 4,
          heightTiles: 4,
          rotation: 0,
          opacity: 1,
          isObstacle: true,
          layer: 'under',
        },
      ],
      tokens: [
        {
          id: 't_1',
          name: 'Guerreiro',
          type: 'player',
          avatar: 'https://avatar.png',
          x: 1,
          y: 1,
          hp: 30,
          maxHp: 30,
          size: 1,
          color: '#3498db',
        },
      ],
    },
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    partyRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      listByMasterId: jest.fn(),
      update: jest.fn(),
    } as any;

    characterRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      listByPartyId: jest.fn(),
      updateReady: jest.fn(),
      updateAppearance: jest.fn(),
      delete: jest.fn(),
    } as any;

    phaseRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByPartyAndNumber: jest.fn(),
      listByPartyId: jest.fn(),
      update: jest.fn(),
    } as any;

    themeService = {
      getAllThemes: jest.fn(),
      getThemeByKey: jest.fn().mockResolvedValue({
        key: 'fantasia_medieval',
        title: 'Fantasia Medieval',
      }),
    } as any;

    partyService = new PartyService(
      partyRepo,
      characterRepo,
      phaseRepo,
      themeService,
    );
  });

  it('createParty should initialize battlemapState with DEFAULT_BATTLEMAP_STATE', async () => {
    partyRepo.findByCode.mockResolvedValue(null);
    partyRepo.create.mockResolvedValue(mockParty);

    const result = await partyService.createParty({
      masterId: 'master123',
      title: 'Mina Perdida',
      themeKey: 'fantasia_medieval',
    });

    expect(partyRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        battlemapState: DEFAULT_BATTLEMAP_STATE,
      }),
    );
    expect(result.party).toBeDefined();
  });

  it('getBattlemapState should return battlemap state by party ID', async () => {
    partyRepo.findById.mockResolvedValue(mockParty);

    const state = await partyService.getBattlemapState('party123');

    expect(partyRepo.findById).toHaveBeenCalledWith('party123');
    expect(state.gridSize).toBe(18);
    expect(state.placedAssets).toHaveLength(1);
    expect(state.tokens).toHaveLength(1);
  });

  it('getBattlemapState should return battlemap state by party code (6 chars)', async () => {
    partyRepo.findByCode.mockResolvedValue(mockParty);

    const state = await partyService.getBattlemapState('ABCDEF');

    expect(partyRepo.findByCode).toHaveBeenCalledWith('ABCDEF');
    expect(state.gridSize).toBe(18);
  });

  it('updateBattlemapState should succeed when called by the party master', async () => {
    partyRepo.findById.mockResolvedValue(mockParty);
    const updatedState = {
      gridSize: 20,
      terrain: { '1-1': 'water' },
      placedAssets: [],
      tokens: [],
    };
    partyRepo.update.mockResolvedValue(
      new PartyEntity(
        mockParty.id,
        mockParty.code,
        mockParty.title,
        mockParty.themeKey,
        mockParty.themeTitle,
        mockParty.masterId,
        mockParty.description,
        mockParty.password,
        mockParty.status,
        mockParty.currentPhaseNumber,
        updatedState,
        mockParty.createdAt,
        new Date(),
      ),
    );

    const response = await partyService.updateBattlemapState(
      'party123',
      'master123',
      updatedState,
    );

    expect(response.success).toBe(true);
    expect(response.battlemapState.gridSize).toBe(20);
    expect(partyRepo.update).toHaveBeenCalledWith('party123', {
      battlemapState: updatedState,
    });
  });

  it('updateBattlemapState should reject if user is not the room master', async () => {
    partyRepo.findById.mockResolvedValue(mockParty);

    await expect(
      partyService.updateBattlemapState('party123', 'otherUser', DEFAULT_BATTLEMAP_STATE),
    ).rejects.toThrow(UnauthorizedPartyAccessException);
  });

  it('updateBattlemapState should throw EntityNotFoundException if party does not exist', async () => {
    partyRepo.findById.mockResolvedValue(null);

    await expect(
      partyService.updateBattlemapState('invalidId', 'master123', DEFAULT_BATTLEMAP_STATE),
    ).rejects.toThrow(EntityNotFoundException);
  });
});
