import {
  AuthTokenResult,
  AuthUseCasePort,
  GuestPlayerCommand,
  LoginMasterCommand,
  RegisterMasterCommand,
} from '../../ports/in/auth.use-case.port';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { PartyRepositoryPort } from '../../ports/out/party.repository.port';
import { TokenProviderPort } from '../../ports/out/token-provider.port';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  EntityNotFoundException,
  InvalidOperationException,
} from '../../domain/exceptions/domain.exception';
import * as bcrypt from 'bcrypt';

export class AuthService implements AuthUseCasePort {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly partyRepo: PartyRepositoryPort,
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  async registerMaster(command: RegisterMasterCommand): Promise<AuthTokenResult> {
    const existingEmail = await this.userRepo.findByEmail(command.email);
    if (existingEmail) {
      throw new InvalidOperationException('Email já cadastrado.');
    }

    const existingUser = await this.userRepo.findByUsername(command.username);
    if (existingUser) {
      throw new InvalidOperationException('Nome de usuário já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(command.password, salt);

    const user = await this.userRepo.create({
      username: command.username,
      email: command.email,
      password: hashedPassword,
      role: 'MASTER',
    });

    const accessToken = this.tokenProvider.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async loginMaster(command: LoginMasterCommand): Promise<AuthTokenResult> {
    let user = await this.userRepo.findByEmail(command.identifier);
    if (!user) {
      user = await this.userRepo.findByUsername(command.identifier);
    }

    if (!user || !user.password) {
      throw new InvalidOperationException('Credenciais inválidas.');
    }

    const passwordMatch = await bcrypt.compare(command.password, user.password);
    if (!passwordMatch) {
      throw new InvalidOperationException('Credenciais inválidas.');
    }

    const accessToken = this.tokenProvider.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async joinPartyAsGuest(command: GuestPlayerCommand): Promise<AuthTokenResult & { partyId: string }> {
    const party = await this.partyRepo.findByCode(command.partyCode.toUpperCase().trim());
    if (!party) {
      throw new EntityNotFoundException('Sessão/Party', command.partyCode);
    }

    if (party.status === 'FINISHED') {
      throw new InvalidOperationException('Esta sessão de RPG já foi finalizada.');
    }

    if (party.password && party.password.trim() !== '') {
      if (!command.partyPassword || command.partyPassword !== party.password) {
        throw new InvalidOperationException('Senha da sala incorreta.');
      }
    }

    // Cria ou recupera jogador temporário para a party
    const guestUsername = `${command.playerName.trim()}_#${Math.floor(1000 + Math.random() * 9000)}`;
    const guestUser = await this.userRepo.create({
      username: guestUsername,
      password: await bcrypt.hash(Math.random().toString(36), 8),
      role: 'PLAYER',
    });

    const accessToken = this.tokenProvider.sign({
      sub: guestUser.id,
      username: command.playerName.trim(),
      role: 'PLAYER',
      partyId: party.id,
      partyCode: party.code,
    });

    return {
      accessToken,
      partyId: party.id,
      user: {
        id: guestUser.id,
        username: command.playerName.trim(),
        role: 'PLAYER',
      },
    };
  }

  async validateUser(userId: string): Promise<UserEntity | null> {
    return this.userRepo.findById(userId);
  }
}
