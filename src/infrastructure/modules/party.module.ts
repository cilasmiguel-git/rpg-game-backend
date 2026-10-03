import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PARTY_USE_CASE_PORT } from '../../core/ports/in/party.use-case.port';
import { PARTY_REPOSITORY_PORT, PartyRepositoryPort } from '../../core/ports/out/party.repository.port';
import { CHARACTER_REPOSITORY_PORT, CharacterRepositoryPort } from '../../core/ports/out/character.repository.port';
import { PHASE_REPOSITORY_PORT, PhaseRepositoryPort } from '../../core/ports/out/phase.repository.port';
import { THEME_USE_CASE_PORT, ThemeUseCasePort } from '../../core/ports/in/theme.use-case.port';
import { PartyService } from '../../core/application/services/party.service';
import { PrismaPartyRepository } from '../adapters/out/persistence/prisma/repositories/prisma-party.repository';
import { PrismaCharacterRepository } from '../adapters/out/persistence/prisma/repositories/prisma-character.repository';
import { PrismaPhaseRepository } from '../adapters/out/persistence/prisma/repositories/prisma-phase.repository';
import { PartyController } from '../adapters/in/http/controllers/party.controller';
import { ThemeModule } from './theme.module';

@Module({
  imports: [ThemeModule, ConfigModule],
  controllers: [PartyController],
  providers: [
    {
      provide: PARTY_REPOSITORY_PORT,
      useClass: PrismaPartyRepository,
    },
    {
      provide: CHARACTER_REPOSITORY_PORT,
      useClass: PrismaCharacterRepository,
    },
    {
      provide: PHASE_REPOSITORY_PORT,
      useClass: PrismaPhaseRepository,
    },
    {
      provide: PARTY_USE_CASE_PORT,
      useFactory: (
        partyRepo: PartyRepositoryPort,
        characterRepo: CharacterRepositoryPort,
        phaseRepo: PhaseRepositoryPort,
        themeService: ThemeUseCasePort,
        config: ConfigService,
      ) => {
        const frontendUrl = config.get<string>('FRONTEND_URL') || 'http://localhost:5173';
        return new PartyService(partyRepo, characterRepo, phaseRepo, themeService, frontendUrl);
      },
      inject: [
        PARTY_REPOSITORY_PORT,
        CHARACTER_REPOSITORY_PORT,
        PHASE_REPOSITORY_PORT,
        THEME_USE_CASE_PORT,
        ConfigService,
      ],
    },
  ],
  exports: [PARTY_USE_CASE_PORT, PARTY_REPOSITORY_PORT],
})
export class PartyModule {}
