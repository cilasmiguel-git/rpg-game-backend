import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { THEME_USE_CASE_PORT, ThemeUseCasePort } from '../../../../../core/ports/in/theme.use-case.port';

@ApiTags('Temáticas de RPG & Skins Pré-definidas')
@Controller('themes')
export class ThemeController {
  constructor(
    @Inject(THEME_USE_CASE_PORT)
    private readonly themeUseCase: ThemeUseCasePort,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas as temáticas disponíveis e seus catálogos de skins, raças e vestimentas',
  })
  @ApiResponse({ status: 200, description: 'Lista de temáticas com opções visuais para criação de personagens.' })
  async listAll() {
    return this.themeUseCase.listAllThemes();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Obter opções visuais e detalhes de uma temática específica' })
  async getByKey(@Param('key') key: string) {
    return this.themeUseCase.getThemeByKey(key);
  }
}
