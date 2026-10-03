import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PHASE_USE_CASE_PORT } from '../../core/ports/in/phase.use-case.port';
import { PHASE_REPOSITORY_PORT, PhaseRepositoryPort } from '../../core/ports/out/phase.repository.port';
import { PARTY_REPOSITORY_PORT, PartyRepositoryPort } from '../../core/ports/out/party.repository.port';
import { CHARACTER_REPOSITORY_PORT, CharacterRepositoryPort } from '../../core/ports/out/character.repository.port';
import { AI_LORE_ENHANCER_PORT, AiLoreEnhancerPort } from '../../core/ports/out/ai-lore-enhancer.port';
import { IMAGE_GENERATOR_PORT, ImageGeneratorPort } from '../../core/ports/out/image-generator.port';
import { PhaseService } from '../../core/application/services/phase.service';
import { PrismaPhaseRepository } from '../adapters/out/persistence/prisma/repositories/prisma-phase.repository';
import { PrismaPartyRepository } from '../adapters/out/persistence/prisma/repositories/prisma-party.repository';
import { PrismaCharacterRepository } from '../adapters/out/persistence/prisma/repositories/prisma-character.repository';
import { AiLoreEnhancerAdapter } from '../adapters/out/ai/ai-lore-enhancer.adapter';
import { ImageGeneratorAdapter } from '../adapters/out/ai/image-generator.adapter';
import { PhaseController } from '../adapters/in/http/controllers/phase.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PhaseController],
  providers: [
    {
      provide: PHASE_REPOSITORY_PORT,
      useClass: PrismaPhaseRepository,
    },
    {
      provide: PARTY_REPOSITORY_PORT,
      useClass: PrismaPartyRepository,
    },
    {
      provide: CHARACTER_REPOSITORY_PORT,
      useClass: PrismaCharacterRepository,
    },
    {
      provide: AI_LORE_ENHANCER_PORT,
      useClass: AiLoreEnhancerAdapter,
    },
    {
      provide: IMAGE_GENERATOR_PORT,
      useClass: ImageGeneratorAdapter,
    },
    {
      provide: PHASE_USE_CASE_PORT,
      useFactory: (
        phaseRepo: PhaseRepositoryPort,
        partyRepo: PartyRepositoryPort,
        characterRepo: CharacterRepositoryPort,
        aiLoreEnhancer: AiLoreEnhancerPort,
        imageGenerator: ImageGeneratorPort,
      ) => new PhaseService(phaseRepo, partyRepo, characterRepo, aiLoreEnhancer, imageGenerator),
      inject: [
        PHASE_REPOSITORY_PORT,
        PARTY_REPOSITORY_PORT,
        CHARACTER_REPOSITORY_PORT,
        AI_LORE_ENHANCER_PORT,
        IMAGE_GENERATOR_PORT,
      ],
    },
  ],
  exports: [PHASE_USE_CASE_PORT, PHASE_REPOSITORY_PORT],
})
export class PhaseModule {}
