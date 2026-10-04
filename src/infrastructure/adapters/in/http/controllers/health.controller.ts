import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaService } from '../../../out/persistence/prisma/prisma.service';

@ApiTags('Health & Conexão')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Verificar status da API' })
  checkApi() {
    return {
      status: 'ok',
      service: 'rpg-backend',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Testar conexão direta com o banco de dados MongoDB' })
  @ApiResponse({ status: 200, description: 'Conexão com MongoDB bem sucedida.' })
  @ApiResponse({ status: 503, description: 'Falha na conexão com o MongoDB.' })
  async checkDatabase(@Res() res: Response) {
    const startTime = Date.now();
    try {
      const pingResult = await this.prisma.$runCommandRaw({ ping: 1 });
      const latencyMs = Date.now() - startTime;

      return res.status(HttpStatus.OK).json({
        status: 'ok',
        database: 'MongoDB',
        connected: true,
        latencyMs: `${latencyMs}ms`,
        ping: pingResult,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        database: 'MongoDB',
        connected: false,
        latencyMs: `${latencyMs}ms`,
        message:
          'Falha ao conectar no MongoDB. Verifique se substituiu <db_password> e se seu IP está liberado no Atlas.',
        error: error.message || error,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
