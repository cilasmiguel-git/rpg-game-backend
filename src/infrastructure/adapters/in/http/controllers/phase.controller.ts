import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PHASE_USE_CASE_PORT, PhaseUseCasePort } from '../../../../../core/ports/in/phase.use-case.port';
import { CreatePhaseDto, RegeneratePhaseAiDto } from '../dtos/phase.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MasterGuard } from '../guards/master.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Fases do RPG & Narrativa com IA & Imagens')
@Controller()
export class PhaseController {
  constructor(
    @Inject(PHASE_USE_CASE_PORT)
    private readonly phaseUseCase: PhaseUseCasePort,
  ) {}

  @Post('parties/:partyId/phases')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Mestre cria uma nova fase do jogo: a IA organiza as anotações do mestre no tom épico do RPG e gera a imagem da cena',
  })
  @ApiResponse({
    status: 201,
    description:
      'Fase criada com narração polida pela IA, atmosfera sensorial, imagem gerada e ganchos para o grupo.',
  })
  async createPhase(
    @Param('partyId') partyId: string,
    @CurrentUser('sub') masterId: string,
    @Body() dto: CreatePhaseDto,
  ) {
    return this.phaseUseCase.createPhase({
      partyId,
      masterId,
      title: dto.title,
      masterNotes: dto.masterNotes,
      autoGenerateImage: dto.autoGenerateImage,
    });
  }

  @Post('phases/:id/regenerate-narration')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mestre solicita à IA para reorganizar/polir a narração novamente com ou sem novas anotações',
  })
  async regenerateNarration(
    @Param('id') phaseId: string,
    @CurrentUser('sub') masterId: string,
    @Body() dto: RegeneratePhaseAiDto,
  ) {
    return this.phaseUseCase.regenerateAiNarration({
      phaseId,
      masterId,
      updatedMasterNotes: dto.updatedMasterNotes,
    });
  }

  @Post('phases/:id/generate-image')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gerar ou atualizar a ilustração artística da fase com IA' })
  async generateImage(@Param('id') phaseId: string, @CurrentUser('sub') masterId: string) {
    return this.phaseUseCase.generateSceneImage(phaseId, masterId);
  }

  @Patch('phases/:id/publish')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mestre publica a fase para exibição direta aos jogadores' })
  async publish(@Param('id') phaseId: string, @CurrentUser('sub') masterId: string) {
    return this.phaseUseCase.publishPhase(phaseId, masterId);
  }

  @Get('parties/:partyId/phases/current')
  @ApiOperation({ summary: 'Obter a fase atual em andamento da sessão (narração, imagem, objetivos)' })
  async getCurrentPhase(@Param('partyId') partyId: string) {
    return this.phaseUseCase.getCurrentPhase(partyId);
  }

  @Get('parties/:partyId/phases')
  @ApiOperation({ summary: 'Listar todas as fases já criadas na campanha/party' })
  async listByParty(@Param('partyId') partyId: string) {
    return this.phaseUseCase.listPhasesByParty(partyId);
  }

  @Get('phases/:id')
  @ApiOperation({ summary: 'Obter detalhes de uma fase específica por ID' })
  async getById(@Param('id') id: string) {
    return this.phaseUseCase.getPhaseById(id);
  }
}
