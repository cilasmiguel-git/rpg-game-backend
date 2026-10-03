export type UserRole = 'MASTER' | 'PLAYER';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email?: string,
    public readonly password?: string,
    public readonly role: UserRole = 'PLAYER',
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
