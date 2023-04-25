import * as cls from 'cls-hooked';
import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from './requestContext';
import { LoggerService } from '../../../modules/logger/logger.service';
import { generateCode } from '../../../utils/codeGenerator';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  public use(req: Request, res: Response, next: () => void): void {
    this.logger.setLogId(generateCode({ length: 8 }));
    const reqContext = new RequestContext(req, res);
    const session =
      cls.getNamespace(RequestContext.nsid) ||
      cls.createNamespace(RequestContext.nsid);
    session.run(async () => {
      session.set(RequestContext.name, reqContext);
      next();
    });
  }
}
