import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/modules/prisma.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { ThemeModule } from './infrastructure/modules/theme.module';
import { PartyModule } from './infrastructure/modules/party.module';
import { CharacterModule } from './infrastructure/modules/character.module';
import { PhaseModule } from './infrastructure/modules/phase.module';
import { HealthController } from './infrastructure/adapters/in/http/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    AuthModule,
    ThemeModule,
    PartyModule,
    CharacterModule,
    PhaseModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

