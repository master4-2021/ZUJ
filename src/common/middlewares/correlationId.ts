import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const correlationId = uuidv4();
    req.headers['x-correlation-id'] = correlationId;
    req.headers['timestamp'] = new Date().toISOString();
    next();
  }
}
