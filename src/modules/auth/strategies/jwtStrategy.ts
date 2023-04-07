import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, ValidatedUser } from '../types';
import { AuthService } from '../auth.service';
import { Inject, Injectable } from '@nestjs/common';
import { JWT_TOKEN } from '../../../common/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @Inject(JWT_TOKEN) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    return {
      username: payload.username,
      userId: payload.sub,
      role: payload.role,
    };
  }
}
