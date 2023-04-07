import * as cls from 'cls-hooked';
import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from './requestContext';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: () => void): void {
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
