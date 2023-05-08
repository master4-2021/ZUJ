import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { EncryptionAndHashService } from '../../../encryptionAndHash/encryptionAndHash.service';
import { ChangePasswordDto, UpdateUserDto } from '../user.dto';
import { UserEntity } from '../user.entity';
import {
  mockChangePasswordDto,
  mockUpdateUserDto,
  mockUser,
  mockUserPayload,
} from './user.mock';
import { UserPayload } from '../user.types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../../../database/test/database.service.mock';
import { HttpStatus } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../common/types';
import { BusinessException } from '../../../../common/exceptions';

const moduleMocker = new ModuleMocker(global);

describe('UserService', () => {
  let userService: UserService;
  let encryptionAndHashService: EncryptionAndHashService;

  let user: UserEntity;
  let userPayload: UserPayload;
  let changePasswordDto: ChangePasswordDto;
  let newHashPassword: string;
  let updateUserDto: UpdateUserDto;

  beforeEach(async () => {
    user = { ...mockUser };
    changePasswordDto = { ...mockChangePasswordDto };
    userPayload = { ...mockUserPayload };
    newHashPassword = '$2b$10$1';
    updateUserDto = { ...mockUpdateUserDto };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    })
      .useMocker((target) => {
        if (target === EncryptionAndHashService) {
          return {
            hash: jest.fn().mockResolvedValue(newHashPassword),
            compare: jest.fn().mockResolvedValue(true),
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

    userService = app.get<UserService>(UserService);
    encryptionAndHashService = app.get<EncryptionAndHashService>(
      EncryptionAndHashService,
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findUsers', () => {
    it('should return user payloads', async () => {
      jest.spyOn(userService, 'find').mockResolvedValue([user]);

      expect(await userService.findUsers({})).toStrictEqual([userPayload]);

      expect(userService.find).toHaveBeenCalledWith({});
    });
  });

  describe('findUserById', () => {
    it('should return user payload', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(user);

      expect(await userService.findUserById(user.id)).toStrictEqual(
        userPayload,
      );

      expect(userService.findById).toHaveBeenCalledWith(user.id);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      expect(await userService.findUserById(user.id)).toBeNull();

      expect(userService.findById).toHaveBeenCalledWith(user.id);
    });
  });

  describe('updateUserById', () => {
    it('should return user payload', async () => {
      jest.spyOn(userService, 'updateById').mockResolvedValue(user);

      expect(await userService.updateUserById(user.id, updateUserDto)).toEqual(
        userPayload,
      );

      expect(userService.updateById).toHaveBeenCalledWith(
        user.id,
        updateUserDto,
      );
    });
  });

  describe('changePassword', () => {
    it('should return updated user payload', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest
        .spyOn(userService, 'updateById')
        .mockResolvedValue({ ...user, password: newHashPassword });

      expect(
        await userService.changePassword(user.id, changePasswordDto),
      ).toStrictEqual(userPayload);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        changePasswordDto.oldPassword,
        user.password,
      );

      expect(encryptionAndHashService.hash).toHaveBeenCalledWith(
        changePasswordDto.newPassword,
      );

      expect(userService.updateById).toHaveBeenCalledWith(user.id, {
        password: newHashPassword,
      });
    });

    it('should throw error if user not found', async () => {
      const error = new BusinessException(
        ErrorMessageEnum.userNotFound,
        HttpStatus.BAD_REQUEST,
      );

      jest.spyOn(userService, 'findById').mockResolvedValue(null);
      jest.spyOn(userService, 'updateById').mockResolvedValue(null);

      await expect(
        userService.changePassword(user.id, changePasswordDto),
      ).rejects.toThrow(error);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.compare).not.toHaveBeenCalled();

      expect(encryptionAndHashService.hash).not.toHaveBeenCalled();

      expect(userService.updateById).not.toHaveBeenCalled();
    });

    it('should throw error if old password is equal to new password', async () => {
      const error = new BusinessException(
        ErrorMessageEnum.oldPasswordEqualNewPassword,
        HttpStatus.BAD_REQUEST,
      );
      changePasswordDto.newPassword = changePasswordDto.oldPassword;

      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userService, 'updateById').mockResolvedValue(null);

      await expect(
        userService.changePassword(user.id, changePasswordDto),
      ).rejects.toThrow(error);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.compare).not.toHaveBeenCalled();

      expect(encryptionAndHashService.hash).not.toHaveBeenCalled();

      expect(userService.updateById).not.toHaveBeenCalled();
    });

    it('should throw error if old password is not correct', async () => {
      const error = new BusinessException(
        ErrorMessageEnum.invalidOldPassword,
        HttpStatus.BAD_REQUEST,
      );

      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(encryptionAndHashService, 'compare').mockResolvedValue(false);
      jest.spyOn(userService, 'updateById').mockResolvedValue(null);

      await expect(
        userService.changePassword(user.id, changePasswordDto),
      ).rejects.toThrow(error);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        changePasswordDto.oldPassword,
        user.password,
      );

      expect(encryptionAndHashService.hash).not.toHaveBeenCalled();

      expect(userService.updateById).not.toHaveBeenCalled();
    });
  });
});
