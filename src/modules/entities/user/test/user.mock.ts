import { Role } from '../../../../common/decorators/roles';
import { ValidatedUser } from '../../../auth/auth.types';
import { ChangePasswordDto, UpdateUserDto } from '../user.dto';
import { UserEntity } from '../user.entity';
import { UserPayload } from '../user.types';
import { v4 as uuid } from 'uuid';

const id = uuid();

const mockUser: UserEntity = {
  id,
  name: 'name',
  email: 'email@gmail.com',
  phone: '1234567890',
  username: 'username',
  password: '$2b$10$Q8',
  role: Role.USER,
};

const mockChangePasswordDto: ChangePasswordDto = {
  oldPassword: 'oldPassword',
  newPassword: 'newPassword',
};

const mockValidatedUser: ValidatedUser = {
  userId: id,
  username: 'username',
  role: Role.USER,
};

const mockUserPayload = {
  id,
  name: 'name',
  email: 'email@gmail.com',
  phone: '1234567890',
  username: 'username',
  role: Role.USER,
} as UserPayload;

const mockUpdateUserDto: UpdateUserDto = {
  name: 'newName',
  email: mockUser.email,
  phone: mockUser.phone,
};

export {
  mockUser,
  mockChangePasswordDto,
  mockUserPayload,
  mockUpdateUserDto,
  mockValidatedUser,
};
