import { Module } from '@nestjs/common';
import { CHARACTER_USE_CASE_PORT } from '../../core/ports/in/character.use-case.port';
import { CHARACTER_REPOSITORY_PORT, CharacterRepositoryPort } from '../../core/ports/out/character.repository.port';
import { PARTY_REPOSITORY_PORT, PartyRepositoryPort } from '../../core/ports/out/party.repository.port';
import { CharacterService } from '../../core/application/services/character.service';
import { PrismaCharacterRepository } from '../adapters/out/persistence/prisma/repositories/prisma-character.repository';
import { PrismaPartyRepository } from '../adapters/out/persistence/prisma/repositories/prisma-party.repository';
import { CharacterController } from '../adapters/in/http/controllers/character.controller';

@Module({
  controllers: [CharacterController],
  providers: [
    {
      provide: CHARACTER_REPOSITORY_PORT,
      useClass: PrismaCharacterRepository,
    },
    {
      provide: PARTY_REPOSITORY_PORT,
      useClass: PrismaPartyRepository,
    },
    {
      provide: CHARACTER_USE_CASE_PORT,
      useFactory: (
        characterRepo: CharacterRepositoryPort,
        partyRepo: PartyRepositoryPort,
      ) => new CharacterService(characterRepo, partyRepo),
      inject: [CHARACTER_REPOSITORY_PORT, PARTY_REPOSITORY_PORT],
    },
  ],
  exports: [CHARACTER_USE_CASE_PORT, CHARACTER_REPOSITORY_PORT],
})
export class CharacterModule {}
