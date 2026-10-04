import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { EntityNotFoundException, InvalidOperationException } from '../../domain/exceptions/domain.exception';

describe('AuthService player flow', () => {
  const makeUserRepo = () => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
  });

  const makePartyRepo = (party: any) => ({
    findByCode: jest.fn().mockResolvedValue(party),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    listByMasterId: jest.fn(),
  });

  it('registerPlayer cria o usuário do jogador e valida a senha da sala', async () => {
    const party = {
      id: 'party-1',
      code: 'ABC123',
      password: 'sala123',
      status: 'LOBBY',
    };

    const userRepo = makeUserRepo();
    userRepo.findByUsername.mockResolvedValue(null);
    userRepo.create.mockImplementation(async ({ username, password, role }) => ({
      id: 'user-1',
      username,
      password,
      role,
    }));

    const tokenProvider = {
      sign: jest.fn().mockReturnValue('jwt-player'),
      verify: jest.fn(),
    };

    const service = new AuthService(userRepo as any, makePartyRepo(party) as any, tokenProvider as any);

    const result = await service.registerPlayer({
      username: 'raven',
      password: 'senhaDoJogador123',
      partyCode: 'ABC123',
      partyPassword: 'sala123',
    });

    expect(userRepo.findByUsername).toHaveBeenCalledWith('raven');
    expect(userRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'raven',
        role: 'PLAYER',
      }),
    );
    expect(tokenProvider.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: 'user-1',
        username: 'raven',
        role: 'PLAYER',
        partyId: 'party-1',
        partyCode: 'ABC123',
      }),
    );
    expect(result.accessToken).toBe('jwt-player');
    expect(await bcrypt.compare('senhaDoJogador123', userRepo.create.mock.calls[0][0].password)).toBe(true);
  });

  it('loginPlayer faz autenticação do jogador existente com senha da sala', async () => {
    const party = {
      id: 'party-2',
      code: 'XYZ999',
      password: 'sala456',
      status: 'LOBBY',
    };

    const hashed = await bcrypt.hash('senhaDoJogador321', 10);
    const userRepo = makeUserRepo();
    userRepo.findByUsername.mockResolvedValue({
      id: 'user-2',
      username: 'lyra',
      password: hashed,
      role: 'PLAYER',
    });

    const tokenProvider = {
      sign: jest.fn().mockReturnValue('jwt-existing-player'),
      verify: jest.fn(),
    };

    const service = new AuthService(userRepo as any, makePartyRepo(party) as any, tokenProvider as any);

    const result = await service.loginPlayer({
      username: 'lyra',
      password: 'senhaDoJogador321',
      partyCode: 'XYZ999',
      partyPassword: 'sala456',
    });

    expect(result.accessToken).toBe('jwt-existing-player');
    expect(tokenProvider.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: 'user-2',
        username: 'lyra',
        partyId: 'party-2',
        partyCode: 'XYZ999',
      }),
    );
  });

  it('registerPlayer rejeita username duplicado', async () => {
    const party = {
      id: 'party-3',
      code: 'QWE321',
      password: '',
      status: 'LOBBY',
    };

    const userRepo = makeUserRepo();
    userRepo.findByUsername.mockResolvedValue({ id: 'existing-user', username: 'raven' });

    const service = new AuthService(userRepo as any, makePartyRepo(party) as any, {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any);

    await expect(
      service.registerPlayer({
        username: 'raven',
        password: 'senhaDoJogador123',
        partyCode: 'QWE321',
      }),
    ).rejects.toThrow(InvalidOperationException);
  });
});
