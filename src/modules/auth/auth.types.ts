import { Role } from '../../common/decorators/roles';
import { DeepHideOrOmit } from '../../common/types';
import { RefreshTokenPayload } from '../entities/refreshToken/refreshToken.types';
import { UserEntity } from '../entities/user/user.entity';

export type JwtPayload = {
  username: string;
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
};

export type ValidatedUser = {
  username: string;
  userId: string;
  role: Role;
};

export type LoginPayload = RefreshTokenPayload;

export type RegisterPayload = DeepHideOrOmit<UserEntity, 'password', true>;
