import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserData, UserRepositoryPort } from '../../../../../../core/ports/out/user.repository.port';
import { UserEntity, UserRole } from '../../../../../../core/domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: any): UserEntity {
    return new UserEntity(
      raw.id,
      raw.username,
      raw.email ?? undefined,
      raw.password,
      raw.role as UserRole,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });
    return this.toDomain(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({ where: { username } });
    return user ? this.toDomain(user) : null;
  }
}
