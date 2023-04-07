import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ErrorMessageEnum,
  UNAUTHORIZED,
} from '../../../common/constants/errors';
import { PUBLIC_KEY } from '../../../common/decorators/public';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.accessTokenIsMissing],
      );
    }
    const isStored = await this.authService.validateAccessToken(accessToken);
    if (!isStored) {
      throw new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.invalidAccessToken],
      );
    }

    return super.canActivate(context) as boolean;
  }
}
