import { UserEntity } from '../../domain/entities/user.entity';

export interface CreateUserData {
  username: string;
  email?: string;
  password: string;
  role: 'MASTER' | 'PLAYER';
}

export interface UserRepositoryPort {
  create(data: CreateUserData): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
}

export const USER_REPOSITORY_PORT = Symbol('UserRepositoryPort');
