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
import { API_CONTEXT, PARSED_FILTER } from '../constants';
import { ResponseBody } from '../types';
import hideOrOmitDeep from '../../utils/hideOrOmitFields';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
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
      map((body: ResponseBody) => {
        this.logger.log_(`"${method}" method invoked successfully!`, target, {
          took: `${Date.now() - now} ms`,
          data: hideOrOmitDeep(body?.data, ['accessToken', 'refreshToken']),
        });
        this.logger.log_(
          `${req.method} ${req.path} successfully!`,
          API_CONTEXT,
          {
            request: getRequestInfo(req),
            response: {
              ...body,
              data: hideOrOmitDeep(body?.data, ['accessToken', 'refreshToken']),
            },
          },
        );
        return body;
      }),
    );
  }
}
