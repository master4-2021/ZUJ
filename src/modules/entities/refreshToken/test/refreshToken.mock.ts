import { DateTime } from 'luxon';
import { RefreshTokenDto, RevokeRefreshTokenDto } from '../refreshToken.dto';
import { RefreshTokenPayload, RevokeTokenPayload } from '../refreshToken.types';
import { JwtPayload, ValidatedUser } from '../../../auth/auth.types';
import { Role } from '../../../../common/decorators/roles';
import { RefreshTokenEntity } from '../refreshToken.entity';
import { v4 as uuid } from 'uuid';

const id = uuid();
const userId = uuid();

const mockRefreshTokenDto: RefreshTokenDto = {
  refreshToken: 'refreshToken',
};

const mockRevokeTokenDto: RevokeRefreshTokenDto = {
  userId,
};

const mockRefreshTokenPayload: RefreshTokenPayload = {
  id,
  userId,
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  refreshExpiresIn: DateTime.now().plus({ days: 30 }).toJSDate(),
};

const mockRevokeTokenPayload: RevokeTokenPayload = {
  refreshExpiresIn: DateTime.now().plus({ days: 30 }).toJSDate(),
};

const mockRefreshTokenRecord: RefreshTokenEntity = {
  id,
  userId,
  refreshToken: 'encryptedRefreshToken',
  refreshExpiresIn: DateTime.now().plus({ days: 30 }).toJSDate(),
};

const mockJwtPayload: JwtPayload = {
  username: 'username',
  role: Role.USER,
  sub: userId,
};

const mockValidatedUser: ValidatedUser = {
  userId: userId,
  username: 'username',
  role: Role.USER,
};

export {
  mockRefreshTokenDto,
  mockRevokeTokenDto,
  mockRefreshTokenPayload,
  mockRevokeTokenPayload,
  mockRefreshTokenRecord,
  mockJwtPayload,
  mockValidatedUser,
};
