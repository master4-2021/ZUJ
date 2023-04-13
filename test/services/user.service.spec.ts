import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/modules/entities/user/user.service';
import { EncryptionAndHashService } from '../../src/modules/encryptionAndHash/encrypttionAndHash.service';
import { ChangePasswordDto } from '../../src/modules/entities/user/user.dto';
import { mockUser } from '../mock/output.mock';
import { mockChangePasswordDto } from '../mock/input.mock';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { UserEntity } from '../../src/modules/entities/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import mockRepository from '../mock/repository.mock';
import { BusinessException } from '../../src/common/exceptions';
import {
  BAD_REQUEST,
  ErrorMessageEnum,
  UNAUTHORIZED,
} from '../../src/common/constants/errors';

const moduleMocker = new ModuleMocker(global);

describe('UserService', () => {
  let userService: UserService;
  let encryptionAndHashService: EncryptionAndHashService;
  let user: UserEntity;
  let changePasswordDto: ChangePasswordDto;
  let newHashPassword: string;

  beforeEach(async () => {
    user = mockUser;
    changePasswordDto = { ...mockChangePasswordDto };
    newHashPassword = '$2b$10$1';
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

  describe('changePassword', () => {
    it('should return updated user', async () => {
      const updatedUser = { ...user, password: newHashPassword };
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(userService, 'updateById').mockResolvedValue(updatedUser);

      expect(
        await userService.changePassword(user.id, changePasswordDto),
      ).toEqual(updatedUser);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.hash).toHaveBeenCalledWith(
        changePasswordDto.newPassword,
      );

      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        changePasswordDto.oldPassword,
        user.password,
      );
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);
      const error = new BusinessException(
        UNAUTHORIZED,
        ErrorMessageEnum.userNotFound,
      );

      await expect(
        userService.changePassword(user.id, changePasswordDto),
      ).rejects.toThrow(error);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.hash).not.toHaveBeenCalled();

      expect(encryptionAndHashService.compare).not.toHaveBeenCalled();
    });

    it('should throw error if old password is equal to new password', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      const error = new BusinessException(
        BAD_REQUEST,
        ErrorMessageEnum.oldPasswordEqualNewPassword,
      );
      changePasswordDto.newPassword = changePasswordDto.oldPassword;

      await expect(
        userService.changePassword(user.id, changePasswordDto),
      ).rejects.toThrow(error);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.hash).not.toHaveBeenCalled();

      expect(encryptionAndHashService.compare).not.toHaveBeenCalled();
    });

    it('should throw error if old password is not correct', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(user);
      jest.spyOn(encryptionAndHashService, 'compare').mockResolvedValue(false);
      const error = new BusinessException(
        BAD_REQUEST,
        ErrorMessageEnum.invalidOldPassword,
      );

      await expect(
        userService.changePassword(user.id, changePasswordDto),
      ).rejects.toThrow(error);

      expect(userService.findById).toHaveBeenCalledWith(user.id);

      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        changePasswordDto.oldPassword,
        user.password,
      );

      expect(encryptionAndHashService.hash).not.toHaveBeenCalled();
    });
  });
});
