import { Module } from '@nestjs/common';
import { THEME_USE_CASE_PORT } from '../../core/ports/in/theme.use-case.port';
import { ThemeService } from '../../core/application/services/theme.service';
import { ThemeController } from '../adapters/in/http/controllers/theme.controller';

@Module({
  controllers: [ThemeController],
  providers: [
    {
      provide: THEME_USE_CASE_PORT,
      useClass: ThemeService,
    },
  ],
  exports: [THEME_USE_CASE_PORT],
})
export class ThemeModule {}
