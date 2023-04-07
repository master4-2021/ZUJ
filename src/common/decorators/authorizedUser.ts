import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedUser } from '../../modules/auth/types';

export const AuthorizedUser = createParamDecorator(
  (_data, ctx: ExecutionContext): ValidatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ValidatedUser;
  },
);
