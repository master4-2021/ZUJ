import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../types';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map((data) => {
        const now = new Date().toISOString();
        const request: Request = context.switchToHttp().getRequest();
        return {
          url: `[${request.method}] ${request.url}`,
          success: true,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'OK',
          data,
          correlationId: request.headers['x-correlation-id'] as string,
          timestamp: now,
          took: `${
            new Date(now).valueOf() -
            new Date(request.headers['timestamp'] as string).valueOf()
          } ms`,
        };
      }),
    );
  }
}
