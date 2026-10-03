import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_USE_CASE_PORT, AuthUseCasePort } from '../../../../../core/ports/in/auth.use-case.port';
import {
  GuestJoinPartyDto,
  LoginMasterDto,
  RegisterMasterDto,
} from '../dtos/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Autenticação & Acesso à Sala')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_USE_CASE_PORT)
    private readonly authUseCase: AuthUseCasePort,
  ) {}

  @Post('register-master')
  @ApiOperation({ summary: 'Cadastrar nova conta de Mestre de RPG' })
  @ApiResponse({ status: 201, description: 'Mestre cadastrado com sucesso e token JWT retornado.' })
  async registerMaster(@Body() dto: RegisterMasterDto) {
    return this.authUseCase.registerMaster(dto);
  }

  @Post('login-master')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do Mestre de RPG' })
  @ApiResponse({ status: 200, description: 'Login efetuado com sucesso.' })
  async loginMaster(@Body() dto: LoginMasterDto) {
    return this.authUseCase.loginMaster(dto);
  }

  @Post('join-guest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Entrar na sala de RPG como Jogador/Convidado via código da Party e senha (se houver)',
  })
  @ApiResponse({
    status: 200,
    description: 'Acesso liberado com token temporário de jogador vinculado à party.',
  })
  async joinGuest(@Body() dto: GuestJoinPartyDto) {
    return this.authUseCase.joinPartyAsGuest(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado no momento' })
  async getMe(@CurrentUser() user: any) {
    const fullUser = await this.authUseCase.validateUser(user.sub);
    return {
      id: user.sub,
      username: user.username,
      role: user.role,
      partyId: user.partyId,
      partyCode: user.partyCode,
      email: fullUser?.email,
    };
  }
}
