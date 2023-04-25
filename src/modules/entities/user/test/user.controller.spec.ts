import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ChangePasswordDto, UpdateUserDto } from '../user.dto';
import { UserPayload } from '../user.types';
import { ValidatedUser } from '../../../auth/auth.types';
import {
  mockChangePasswordDto,
  mockUpdateUserDto,
  mockUserPayload,
  mockValidatedUser,
} from './user.mock';

const moduleMocker = new ModuleMocker(global);

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  let userPayload: UserPayload;
  let changePasswordDto: ChangePasswordDto;
  let updateUserDto: UpdateUserDto;
  let validatedUser: ValidatedUser;

  beforeEach(async () => {
    userPayload = { ...mockUserPayload };
    changePasswordDto = { ...mockChangePasswordDto };
    updateUserDto = { ...mockUpdateUserDto };
    validatedUser = { ...mockValidatedUser };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((target) => {
        if (target === UserService) {
          return {
            findUsers: jest.fn().mockResolvedValue([userPayload]),
            findUserById: jest.fn().mockResolvedValue(userPayload),
            updateUserById: jest.fn().mockResolvedValue(userPayload),
            changePassword: jest.fn().mockResolvedValue(userPayload),
          };
        }

        if (typeof target === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            target,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user', async () => {
      expect(await userController.findById('id')).toStrictEqual(userPayload);

      expect(userService.findUserById).toHaveBeenCalledWith('id');
    });
  });

  describe('findUsers', () => {
    it('should return a list of users', async () => {
      expect(await userController.findUsers({})).toStrictEqual([userPayload]);

      expect(userService.findUsers).toHaveBeenCalledWith({});
    });
  });

  describe('getProfile', () => {
    it('should return a user', async () => {
      expect(await userController.getProfile(validatedUser)).toStrictEqual(
        userPayload,
      );

      expect(userService.findUserById).toHaveBeenCalledWith(
        validatedUser.userId,
      );
    });
  });

  describe('updateById', () => {
    it('should return a user', async () => {
      expect(
        await userController.updateById(validatedUser, updateUserDto),
      ).toStrictEqual(userPayload);

      expect(userService.updateUserById).toHaveBeenCalledWith(
        validatedUser.userId,
        updateUserDto,
      );
    });
  });

  describe('changePassword', () => {
    it('should return a user', async () => {
      expect(
        await userController.changePassword('id', changePasswordDto),
      ).toStrictEqual(userPayload);

      expect(userService.changePassword).toHaveBeenCalledWith(
        'id',
        changePasswordDto,
      );
    });
  });
});
