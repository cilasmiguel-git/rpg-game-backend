import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TOKEN_PROVIDER_PORT, TokenProviderPort } from '../../../../../core/ports/out/token-provider.port';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido ou inválido.');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.tokenProvider.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Sessão expirada ou token inválido.');
    }
  }
}
