import { DeleteResult } from 'typeorm';
import { Role } from '../../src/common/decorators/roles';
import { RefreshTokenEntity } from '../../src/modules/entities/refreshToken/refreshToken.entity';
import { UserEntity } from '../../src/modules/entities/user/user.entity';
import { DateTime } from 'luxon';
import { JwtPayload } from '../../src/modules/auth/types';
import { RefreshTokenPayload } from '../../src/modules/entities/refreshToken/types';

// Data output

const mockRefreshToken: RefreshTokenEntity = {
  id: 'id',
  refreshToken: 'encryptedRefreshToken',
  refreshExpiresIn: DateTime.now().plus({ days: 30 }).toJSDate(),
  userId: 'id',
  user: {
    id: 'id',
    username: 'username',
    email: 'email@gmail.com',
    phone: '1234567890',
    name: 'name',
    role: Role.USER,
  },
};

const mockDeleteResult: DeleteResult = {
  raw: 'raw',
  affected: 1,
};

const mockUser: UserEntity = {
  id: 'id',
  name: 'name',
  email: 'email@gmail.com',
  phone: '1234567890',
  username: 'username',
  password: '$2b$10$Q8',
  role: Role.USER,
};

const mockJwtPayload: JwtPayload = {
  username: 'username',
  role: Role.USER,
  sub: 'id',
};

const mockRefreshTokenPayload: RefreshTokenPayload = {
  ...mockRefreshToken,
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
};

export {
  mockRefreshToken,
  mockDeleteResult,
  mockUser,
  mockJwtPayload,
  mockRefreshTokenPayload,
};
