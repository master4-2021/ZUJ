import { DeleteResult } from 'typeorm';
import { Role } from '../../src/common/decorators/roles';
import { LoginDto, RegisterDto } from '../../src/modules/auth/auth.dto';
import { ValidatedUser } from '../../src/modules/auth/types';
import {
  RefreshTokenDto,
  RevokeTokenDto,
} from '../../src/modules/entities/token/token.dto';
import { TokenEntity } from '../../src/modules/entities/token/token.entity';
import { UserEntity } from '../../src/modules/entities/user/user.entity';
import { DateTime } from 'luxon';

// Data input
const mockLoginDto: LoginDto = {
  username: 'test',
  password: 'test',
};

const mockRegisterDto: RegisterDto = {
  name: 'test',
  email: 'test@gmail.com',
  phone: '1234567890',
  username: 'test',
  password: 'test',
};

const mockRefreshTokenDto: RefreshTokenDto = {
  refreshToken: 'test',
};

const mockRevokeTokenDto: RevokeTokenDto = {
  userId: 'test',
};

const mockValidatedUser: ValidatedUser = {
  userId: 'test',
  username: 'test',
  role: Role.USER,
};

// Data output

const mockToken: TokenEntity = {
  accessToken: 'test',
  refreshToken: 'test',
  refreshExpiresIn: DateTime.now().toJSDate(),
  userId: 'test',
  user: {
    id: 'test',
    username: 'test',
    email: 'test@gmail.com',
    phone: '1234567890',
    name: 'test',
    role: Role.USER,
  },
};

const mockDeleteResult: DeleteResult = {
  raw: 'test',
  affected: 1,
};

const mockUser: UserEntity = {
  id: 'test',
  name: 'test',
  email: 'test@gmail.com',
  phone: '1234567890',
  username: 'test',
  password: 'test',
  role: Role.USER,
};

export {
  mockLoginDto,
  mockRegisterDto,
  mockRefreshTokenDto,
  mockRevokeTokenDto,
  mockValidatedUser,
  mockToken,
  mockDeleteResult,
  mockUser,
};
