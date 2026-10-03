import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CHARACTER_USE_CASE_PORT,
  CharacterUseCasePort,
} from '../../../../../core/ports/in/character.use-case.port';
import { CreateCharacterDto, UpdateCharacterDto } from '../dtos/character.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Criação Visual de Personagens & Skins')
@Controller()
export class CharacterController {
  constructor(
    @Inject(CHARACTER_USE_CASE_PORT)
    private readonly characterUseCase: CharacterUseCasePort,
  ) {}

  @Post('parties/:partyId/characters')
  @ApiOperation({
    summary: 'Criar personagem de forma visual com sexo, cor, raça, roupas, armas e detalhes de skin',
  })
  @ApiResponse({ status: 201, description: 'Personagem criado com sucesso na party.' })
  async createCharacter(
    @Param('partyId') partyId: string,
    @Body() dto: CreateCharacterDto,
    @Req() req: any,
  ) {
    // Se o jogador estiver autenticado via token, pegamos o userId dele
    const userId = req.user?.sub;
    return this.characterUseCase.createCharacter({
      partyId,
      userId,
      playerName: dto.playerName,
      name: dto.name,
      characterClass: dto.characterClass,
      appearance: dto.appearance,
      stats: dto.stats,
    });
  }

  @Get('parties/:partyId/characters')
  @ApiOperation({ summary: 'Listar todos os personagens criados nesta party' })
  async listByParty(@Param('partyId') partyId: string) {
    return this.characterUseCase.listCharactersByParty(partyId);
  }

  @Get('characters/:id')
  @ApiOperation({ summary: 'Obter dados e visual detalhado de um personagem específico' })
  async getById(@Param('id') id: string) {
    return this.characterUseCase.getCharacterById(id);
  }

  @Patch('characters/:id')
  @ApiOperation({ summary: 'Atualizar visual, vestimenta, arma ou dados do personagem' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCharacterDto,
    @Req() req: any,
  ) {
    const requestingUserId = req.user?.sub;
    return this.characterUseCase.updateCharacter({
      characterId: id,
      requestingUserId,
      name: dto.name,
      characterClass: dto.characterClass,
      appearance: dto.appearance,
      stats: dto.stats,
      isReady: dto.isReady,
    });
  }

  @Patch('characters/:id/ready')
  @ApiOperation({ summary: 'Alternar estado de "Pronto" do jogador na sala/lobby' })
  async toggleReady(@Param('id') id: string) {
    return this.characterUseCase.toggleReady(id);
  }

  @Delete('characters/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir personagem' })
  async delete(@Param('id') id: string, @CurrentUser('sub') requestingUserId: string) {
    await this.characterUseCase.deleteCharacter(id, requestingUserId);
    return { success: true, message: 'Personagem removido com sucesso.' };
  }
}
