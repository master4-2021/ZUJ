import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  UnauthorizedException,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../../modules/logger/logger.service';
import getApiInfo from '../../utils/apiInfo';
import { generateCode } from '../../utils/codeGenerator';
import { API_CONTEXT } from '../constants';
import {
  ErrorMessageEnum,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  UNAUTHORIZED,
} from '../constants/errors';
import { CustomException } from '../exceptions';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = host.switchToHttp().getRequest() as Request;
    const correlationId = req.headers['x-correlation-id'];

    this.logger.setLogId(generateCode({ length: 8 }));
    this.logger.error_(
      `Failed to ${req.method} ${req.url}`,
      error,
      API_CONTEXT,
      {
        request: getApiInfo(req),
      },
    );
    const response = this.getErrorResponse(error);
    const now = new Date().toISOString();

    ctx
      .getResponse()
      .status(response.statusCode)
      .json({
        url: `[${req.method}] ${req.url}`,
        ...response,
        correlationId,
        timestamp: now,
        took: `${
          new Date(now).valueOf() -
          new Date(req.headers['timestamp'] as string).valueOf()
        } ms`,
      });
  }

  private getErrorResponse(error: Error) {
    let status = 500;
    let message: string | object =
      INTERNAL_SERVER_ERROR.messages[ErrorMessageEnum.internalServerError];
    let code: string = INTERNAL_SERVER_ERROR.code;

    if (error instanceof CustomException) {
      status = error.getStatus();
      message = error.getResponse();
      code = error.getCode();
    }

    if (error instanceof UnauthorizedException) {
      status = error.getStatus();
      message = error.getResponse()['message'];
      code = UNAUTHORIZED.code;
    }

    if (error instanceof ForbiddenException) {
      status = error.getStatus();
      message = error.getResponse()['message'];
      code = FORBIDDEN.code;
    }

    if (error instanceof ServiceUnavailableException) {
      status = error.getStatus();
      message = error.getResponse();
      code = SERVICE_UNAVAILABLE_ERROR.code;
    }

    return {
      success: false,
      statusCode: status,
      code,
      message,
    };
  }
}
