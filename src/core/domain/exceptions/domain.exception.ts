export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entity: string, identifier: string) {
    super(`${entity} com identificador '${identifier}' não foi encontrado.`);
    this.name = 'EntityNotFoundException';
  }
}

export class InvalidOperationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOperationException';
  }
}

export class UnauthorizedPartyAccessException extends DomainException {
  constructor(message: string = 'Acesso negado à sessão/party.') {
    super(message);
    this.name = 'UnauthorizedPartyAccessException';
  }
}
