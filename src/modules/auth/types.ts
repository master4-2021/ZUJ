import { Role } from '../../common/decorators/roles';

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
