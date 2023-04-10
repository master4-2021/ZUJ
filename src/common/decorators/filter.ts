import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ParsedFilterQuery } from '../../modules/filter/types';
import { PARSED_FILTER } from '../constants';

export const Filter = createParamDecorator(
  <T>(_data, ctx: ExecutionContext): ParsedFilterQuery<T> => {
    const request = ctx.switchToHttp().getRequest();
    return request[PARSED_FILTER] as ParsedFilterQuery<T>;
  },
);
