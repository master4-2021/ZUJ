import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PARSED_FILTER } from '../constants';

export const Filter = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[PARSED_FILTER] || {};
});
