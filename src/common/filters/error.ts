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
import getRequestInfo from '../../utils/requestInfo';
import { API_CONTEXT, CORRELATIONID, TIMESTAMPS } from '../constants';
import { CustomException } from '../exceptions';
import { DateTime } from 'luxon';
import { messages } from '../constants/errorMessages';
import { Message } from '../types';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = host.switchToHttp().getRequest() as Request;
    const correlationId = req.headers[CORRELATIONID];

    const now = DateTime.now().toISO();
    const errorResponse = this.getErrorResponse(error);
    const response = {
      url: `[${req.method}] ${req.url}`,
      ...errorResponse,
      correlationId,
      timestamp: now,
      took: `${
        DateTime.fromISO(now).valueOf() -
        DateTime.fromISO(req.headers[TIMESTAMPS] as string).valueOf()
      } ms`,
    };

    this.logger.error_(
      `Failed to ${req.method} ${req.url}`,
      error,
      API_CONTEXT,
      {
        request: getRequestInfo(req),
        response,
      },
    );

    ctx.getResponse().status(response.statusCode).json(response);
  }

  private getErrorResponse(error: Error) {
    let status = 500;
    let message: string | object = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (error instanceof CustomException) {
      status = error.getStatus();
      message = error.getResponse();
      code = error.getCode();
    }

    if (error instanceof UnauthorizedException) {
      status = error.getStatus();
      const { message: errorMessage, code: errorCode } = this.getErrorMessage(
        error.getResponse(),
        'UNAUTHORIZED',
      );
      message = errorMessage;
      code = errorCode;
    }

    if (error instanceof ForbiddenException) {
      status = error.getStatus();
      const { message: errorMessage, code: errorCode } = this.getErrorMessage(
        error.getResponse(),
        'FORBIDDEN',
      );
      message = errorMessage;
      code = errorCode;
    }

    if (error instanceof ServiceUnavailableException) {
      status = error.getStatus();
      const { message: errorMessage, code: errorCode } = this.getErrorMessage(
        error.getResponse(),
        'SERVICE_UNAVAILABLE',
      );
      message = errorMessage;
      code = errorCode;
    }

    return {
      success: false,
      statusCode: status,
      code,
      message,
    };
  }

  private getErrorMessage(errorResponse: string | object, defaultCode: string) {
    const responseMessage = messages[errorResponse['message']] as Message;
    if (responseMessage) {
      return {
        message: responseMessage.content,
        code: responseMessage.code,
      };
    }
    return {
      message: errorResponse['message'] || errorResponse,
      code: defaultCode,
    };
  }
}
