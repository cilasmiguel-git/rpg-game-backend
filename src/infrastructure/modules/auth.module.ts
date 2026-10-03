import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_USE_CASE_PORT } from '../../core/ports/in/auth.use-case.port';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../../core/ports/out/user.repository.port';
import { PARTY_REPOSITORY_PORT, PartyRepositoryPort } from '../../core/ports/out/party.repository.port';
import { TOKEN_PROVIDER_PORT, TokenProviderPort } from '../../core/ports/out/token-provider.port';
import { AuthService } from '../../core/application/services/auth.service';
import { PrismaUserRepository } from '../adapters/out/persistence/prisma/repositories/prisma-user.repository';
import { PrismaPartyRepository } from '../adapters/out/persistence/prisma/repositories/prisma-party.repository';
import { JwtTokenProviderAdapter } from '../adapters/out/auth/jwt-token-provider.adapter';
import { AuthController } from '../adapters/in/http/controllers/auth.controller';
import { JwtAuthGuard } from '../adapters/in/http/guards/jwt-auth.guard';
import { MasterGuard } from '../adapters/in/http/guards/master.guard';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'rpg-secret-key-fallback-2026',
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '7d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: PARTY_REPOSITORY_PORT,
      useClass: PrismaPartyRepository,
    },
    {
      provide: TOKEN_PROVIDER_PORT,
      useClass: JwtTokenProviderAdapter,
    },
    {
      provide: AUTH_USE_CASE_PORT,
      useFactory: (
        userRepo: UserRepositoryPort,
        partyRepo: PartyRepositoryPort,
        tokenProvider: TokenProviderPort,
      ) => new AuthService(userRepo, partyRepo, tokenProvider),
      inject: [USER_REPOSITORY_PORT, PARTY_REPOSITORY_PORT, TOKEN_PROVIDER_PORT],
    },
    JwtAuthGuard,
    MasterGuard,
  ],
  exports: [AUTH_USE_CASE_PORT, USER_REPOSITORY_PORT, TOKEN_PROVIDER_PORT, JwtAuthGuard, MasterGuard],
})
export class AuthModule {}
