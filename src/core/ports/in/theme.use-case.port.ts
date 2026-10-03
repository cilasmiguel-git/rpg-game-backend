import { ThemeEntity } from '../../domain/entities/theme.entity';

export interface ThemeUseCasePort {
  listAllThemes(): Promise<ThemeEntity[]>;
  getThemeByKey(key: string): Promise<ThemeEntity>;
}

export const THEME_USE_CASE_PORT = Symbol('ThemeUseCasePort');
