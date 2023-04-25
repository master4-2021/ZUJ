import { DateTime } from 'luxon';
import { Role } from '../../../common/decorators/roles';
import { LoginDto, RegisterDto } from '../auth.dto';
import { LoginPayload, RegisterPayload, ValidatedUser } from '../auth.types';
import { UserEntity } from '../../entities/user/user.entity';
import hideOrOmitDeep from '../../../utils/hideOrOmitFields';
import { v4 as uuid } from 'uuid';

const userId = uuid();

const mockValidatedUser: ValidatedUser = {
  username: 'username',
  userId,
  role: Role.USER,
};

const mockRegisterDto: RegisterDto = {
  name: 'name',
  email: 'email@gmail.com',
  phone: '1234567890',
  username: 'username',
  password: 'password',
};

const mockLoginDto: LoginDto = {
  username: 'username',
  password: 'password',
};

const mockLoginPayload: LoginPayload = {
  userId,
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  refreshExpiresIn: DateTime.now().plus({ days: 30 }).toJSDate(),
};

const mockUserRecord: UserEntity = {
  id: userId,
  name: 'name',
  email: 'email@gmail.com',
  phone: '1234567890',
  username: 'username',
  password: '$2b$10$Q8',
  role: Role.USER,
};

const mockRegisterPayload: RegisterPayload = hideOrOmitDeep(
  mockUserRecord,
  ['password'],
  true,
);

export {
  mockValidatedUser,
  mockRegisterDto,
  mockLoginDto,
  mockLoginPayload,
  mockUserRecord,
  mockRegisterPayload,
};
