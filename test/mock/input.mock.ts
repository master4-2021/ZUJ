import { Role } from '../../src/common/decorators/roles';
import { LoginDto, RegisterDto } from '../../src/modules/auth/auth.dto';
import { ValidatedUser } from '../../src/modules/auth/types';
import {
  RefreshTokenDto,
  RevokeTokenDto,
} from '../../src/modules/entities/refreshToken/refreshToken.dto';
import { ChangePasswordDto } from '../../src/modules/entities/user/user.dto';

const mockLoginDto: LoginDto = {
  username: 'username',
  password: 'password',
};

const mockRegisterDto: RegisterDto = {
  name: 'name',
  email: 'email@gmail.com',
  phone: '1234567890',
  username: 'username',
  password: 'password',
};

const mockChangePasswordDto: ChangePasswordDto = {
  oldPassword: 'oldPassword',
  newPassword: 'newPassword',
};

const mockRefreshTokenDto: RefreshTokenDto = {
  refreshToken: 'refreshToken',
};

const mockRevokeTokenDto: RevokeTokenDto = {
  userId: 'id',
};

const mockValidatedUser: ValidatedUser = {
  userId: 'id',
  username: 'username',
  role: Role.USER,
};

export {
  mockLoginDto,
  mockRegisterDto,
  mockRefreshTokenDto,
  mockRevokeTokenDto,
  mockValidatedUser,
  mockChangePasswordDto,
};
