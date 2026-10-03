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
import { PARTY_USE_CASE_PORT, PartyUseCasePort } from '../../../../../core/ports/in/party.use-case.port';
import { CreatePartyDto, UpdatePartyStatusDto } from '../dtos/party.dto';
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
}
