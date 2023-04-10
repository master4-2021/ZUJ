import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map } from 'rxjs';
import { LoggerService } from '../../modules/logger/logger.service';
import getRequestInfo from '../../utils/requestInfo';
import { generateCode } from '../../utils/codeGenerator';
import { API_CONTEXT, PARSED_FILTER } from '../constants';
import { Response } from '../types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    this.logger.setLogId(generateCode({ length: 8 }));

    const req = ctx.switchToHttp().getRequest() as Request;
    const target = ctx.getClass().name;
    const method = ctx.getHandler().name;
    const now = Date.now();

    this.logger.log_(`${req.method} ${req.path}`, API_CONTEXT);
    if (req.method === 'GET' && req[PARSED_FILTER]) {
      this.logger.log_(
        `Get parsed filter query`,
        API_CONTEXT,
        req[PARSED_FILTER],
      );
    }
    this.logger.log_(`Invoking "${method}" method...`, target);

    return next.handle().pipe(
      map((data: Response) => {
        this.logger.log_(`"${method}" method invoked successfully!`, target, {
          took: `${Date.now() - now} ms`,
          data: data?.data,
        });
        this.logger.log_(
          `${req.method} ${req.path} successfully!`,
          API_CONTEXT,
          {
            request: getRequestInfo(req),
            response: data,
          },
        );
        return data;
      }),
    );
  }
}
