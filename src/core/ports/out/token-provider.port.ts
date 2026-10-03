export interface TokenPayload {
  sub: string;
  username: string;
  role: 'MASTER' | 'PLAYER';
  partyId?: string;
  partyCode?: string;
}

export interface TokenProviderPort {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}

export const TOKEN_PROVIDER_PORT = Symbol('TokenProviderPort');
