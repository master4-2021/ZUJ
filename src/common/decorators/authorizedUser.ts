import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedUser } from '../../modules/auth/types';
import { Request } from 'express';

export const AuthorizedUser = createParamDecorator(
  (_data, ctx: ExecutionContext): ValidatedUser => {
    const request = ctx.switchToHttp().getRequest() as Request;
    return request.user as ValidatedUser;
  },
);
