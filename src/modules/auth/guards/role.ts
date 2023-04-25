import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../../../common/decorators/roles';
import { ValidatedUser } from '../auth.types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user: ValidatedUser = context.switchToHttp().getRequest().user;

    if (user?.role === Role.ROOT) {
      return true;
    }

    const isCanActivate = requiredRoles.some((role) => role === user?.role);
    if (!isCanActivate) {
      throw new ForbiddenException();
    }
    return isCanActivate;
  }
}
