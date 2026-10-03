import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  EntityNotFoundException,
  InvalidOperationException,
  UnauthorizedPartyAccessException,
} from '../../../../../core/domain/exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;

    if (exception instanceof EntityNotFoundException) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof UnauthorizedPartyAccessException) {
      status = HttpStatus.FORBIDDEN;
    } else if (exception instanceof InvalidOperationException) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
