import { UserEntity } from '../../domain/entities/user.entity';

export interface RegisterMasterCommand {
  username: string;
  email: string;
  password: string;
}

export interface LoginMasterCommand {
  identifier: string; // username or email
  password: string;
}

export interface GuestPlayerCommand {
  playerName: string;
  partyCode: string;
  partyPassword?: string;
}

export interface AuthTokenResult {
  accessToken: string;
  user: {
    id: string;
    username: string;
    role: string;
    email?: string;
  };
}

export interface AuthUseCasePort {
  registerMaster(command: RegisterMasterCommand): Promise<AuthTokenResult>;
  loginMaster(command: LoginMasterCommand): Promise<AuthTokenResult>;
  joinPartyAsGuest(command: GuestPlayerCommand): Promise<AuthTokenResult & { partyId: string }>;
  validateUser(userId: string): Promise<UserEntity | null>;
}

export const AUTH_USE_CASE_PORT = Symbol('AuthUseCasePort');
