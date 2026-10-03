import { ThemeEntity } from '../../domain/entities/theme.entity';
import { ThemeUseCasePort } from '../../ports/in/theme.use-case.port';
import { PREDEFINED_THEMES } from '../data/predefined-themes';
import { EntityNotFoundException } from '../../domain/exceptions/domain.exception';

export class ThemeService implements ThemeUseCasePort {
  async listAllThemes(): Promise<ThemeEntity[]> {
    return PREDEFINED_THEMES;
  }

  async getThemeByKey(key: string): Promise<ThemeEntity> {
    const theme = PREDEFINED_THEMES.find((t) => t.key === key);
    if (!theme) {
      throw new EntityNotFoundException('Tema', key);
    }
    return theme;
  }
}
