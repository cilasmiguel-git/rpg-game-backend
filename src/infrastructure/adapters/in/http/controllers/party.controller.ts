import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PARTY_USE_CASE_PORT, PartyUseCasePort } from '../../../../../core/ports/in/party.use-case.port';
import { CreatePartyDto, UpdatePartyStatusDto } from '../dtos/party.dto';
import { BattlemapStateDto } from '../dtos/battlemap.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MasterGuard } from '../guards/master.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Parties & Sessões de RPG')
@Controller('parties')
export class PartyController {
  constructor(
    @Inject(PARTY_USE_CASE_PORT)
    private readonly partyUseCase: PartyUseCasePort,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mestre cria uma nova sala/party de RPG com temática pré-definida' })
  @ApiResponse({ status: 201, description: 'Party criada com código e link direto para os amigos entrarem.' })
  async createParty(@CurrentUser('sub') masterId: string, @Body() dto: CreatePartyDto) {
    return this.partyUseCase.createParty({
      masterId,
      title: dto.title,
      themeKey: dto.themeKey,
      description: dto.description,
      password: dto.password,
    });
  }

  @Get('my-hosted')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as campanhas/parties criadas pelo Mestre autenticado' })
  async getMyParties(@CurrentUser('sub') masterId: string) {
    return this.partyUseCase.listMasterParties(masterId);
  }

  @Get('code/:code/battlemap')
  @ApiOperation({ summary: 'Obter o estado atual do Battlemap da sala pelo Código da sala' })
  @ApiResponse({ status: 200, description: 'Retorna a grade, terrenos, assets e tokens posicionados.' })
  async getBattlemapByCode(@Param('code') code: string) {
    return this.partyUseCase.getBattlemapState(code);
  }

  @Get('code/:code')
  @ApiOperation({
    summary: 'Consultar informações do Lobby através do código da sala (link enviado aos amigos)',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna dados da party, lista de personagens já criados e fase atual.',
  })
  async getByCode(@Param('code') code: string) {
    return this.partyUseCase.getPartyByCode(code);
  }

  @Get(':id/battlemap')
  @ApiOperation({ summary: 'Obter o estado atual do Battlemap da sala pelo ID' })
  @ApiResponse({ status: 200, description: 'Retorna a grade, terrenos, assets e tokens posicionados.' })
  async getBattlemapById(@Param('id') id: string) {
    return this.partyUseCase.getBattlemapState(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes da party pelo ID' })
  async getById(@Param('id') id: string) {
    return this.partyUseCase.getPartyById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mestre atualiza o status da party (LOBBY -> IN_PROGRESS -> FINISHED)' })
  async updateStatus(
    @Param('id') partyId: string,
    @CurrentUser('sub') masterId: string,
    @Body() dto: UpdatePartyStatusDto,
  ) {
    return this.partyUseCase.updateStatus(partyId, masterId, dto.status);
  }

  @Put(':id/battlemap')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mestre atualiza/salva o estado do Battlemap (terrenos, construções, tokens)' })
  @ApiResponse({ status: 200, description: 'Estado do Battlemap salvo com sucesso.' })
  async updateBattlemap(
    @Param('id') partyId: string,
    @CurrentUser('sub') masterId: string,
    @Body() dto: BattlemapStateDto,
  ) {
    return this.partyUseCase.updateBattlemapState(partyId, masterId, dto);
  }

  @Patch(':id/battlemap')
  @UseGuards(JwtAuthGuard, MasterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mestre atualiza/salva o estado do Battlemap (PATCH)' })
  @ApiResponse({ status: 200, description: 'Estado do Battlemap salvo com sucesso.' })
  async patchBattlemap(
    @Param('id') partyId: string,
    @CurrentUser('sub') masterId: string,
    @Body() dto: BattlemapStateDto,
  ) {
    return this.partyUseCase.updateBattlemapState(partyId, masterId, dto);
  }
}
