import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { RefreshTokenService } from '../../entities/refreshToken/refreshToken.service';
import { UserEntity } from '../../entities/user/user.entity';
import { UserService } from '../../entities/user/user.service';
import { LoginDto, RegisterDto } from '../auth.dto';
import { AuthService } from '../auth.service';
import { ValidatedUser, LoginPayload, RegisterPayload } from '../auth.types';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  mockLoginDto,
  mockLoginPayload,
  mockRegisterDto,
  mockRegisterPayload,
  mockUserRecord,
  mockValidatedUser,
} from './auth.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../common/types';
import { Role } from '../../../common/decorators/roles';
import { BusinessException } from '../../../common/exceptions';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let authService: AuthService;
  let encryptionAndHashService: EncryptionAndHashService;
  let userService: UserService;
  let refreshTokenService: RefreshTokenService;

  let userRecord: UserEntity;
  let registerDto: RegisterDto;
  let loginDto: LoginDto;
  let validatedUser: ValidatedUser;
  let loginPayload: LoginPayload;
  let hashedPassword: string;
  let registerPayload: RegisterPayload;

  beforeEach(async () => {
    userRecord = { ...mockUserRecord };
    registerDto = { ...mockRegisterDto };
    validatedUser = { ...mockValidatedUser };
    loginPayload = { ...mockLoginPayload };
    hashedPassword = '$2b$10$Q8';
    loginDto = { ...mockLoginDto };
    registerPayload = { ...mockRegisterPayload };

    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((target) => {
        if (target === UserService) {
          return {
            findOne: jest.fn().mockResolvedValue(userRecord),
            save: jest.fn().mockResolvedValue(userRecord),
          };
        }

        if (target === RefreshTokenService) {
          return {
            createToken: jest.fn().mockResolvedValue(loginPayload),
          };
        }

        if (target === EncryptionAndHashService) {
          return {
            compare: jest.fn().mockResolvedValue(true),
            hash: jest.fn().mockResolvedValue(hashedPassword),
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

    authService = app.get<AuthService>(AuthService);
    encryptionAndHashService = app.get<EncryptionAndHashService>(
      EncryptionAndHashService,
    );
    userService = app.get<UserService>(UserService);
    refreshTokenService = app.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return an validated user', async () => {
      expect(
        await authService.validateUser(loginDto.username, loginDto.password),
      ).toStrictEqual(validatedUser);

      expect(userService.findOne).toHaveBeenCalledWith({
        where: [{ username: loginDto.username }],
      });

      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        loginDto.password,
        userRecord.password,
      );
    });

    it('should throw unauthorized error when user not found when validate user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      const error = new UnauthorizedException(
        ErrorMessageEnum.invalidCredentials,
      );

      await expect(
        authService.validateUser(loginDto.username, loginDto.password),
      ).rejects.toThrowError(error);

      expect(userService.findOne).toHaveBeenCalledWith({
        where: [{ username: loginDto.username }],
      });

      expect(encryptionAndHashService.compare).not.toHaveBeenCalled();
    });

    it('should throw unauthorized error when password not match when validate user', async () => {
      jest.spyOn(encryptionAndHashService, 'compare').mockResolvedValue(false);
      const error = new UnauthorizedException(
        ErrorMessageEnum.invalidCredentials,
      );

      await expect(
        authService.validateUser(loginDto.username, loginDto.password),
      ).rejects.toThrowError(error);

      expect(userService.findOne).toHaveBeenCalledWith({
        where: [{ username: loginDto.username }],
      });

      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        loginDto.password,
        userRecord.password,
      );
    });
  });

  describe('login', () => {
    it('should return token when login', async () => {
      expect(await authService.login(validatedUser)).toStrictEqual(
        loginPayload,
      );

      expect(refreshTokenService.createToken).toHaveBeenCalledWith(
        validatedUser,
      );
    });
  });

  describe('register', () => {
    it('should return an user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      expect(await authService.register(registerDto)).toStrictEqual(
        registerPayload,
      );

      expect(userService.findOne).toHaveBeenCalledWith({
        where: [
          { username: registerDto.username },
          { email: registerDto.email },
        ],
      });

      expect(encryptionAndHashService.hash).toHaveBeenCalledWith(
        registerDto.password,
      );

      expect(userService.save).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
        role: Role.USER,
      });
    });

    it('should throw user existed error when register', async () => {
      const error = new BusinessException(
        ErrorMessageEnum.userExisted,
        HttpStatus.CONFLICT,
      );

      await expect(authService.register(registerDto)).rejects.toThrowError(
        error,
      );

      expect(userService.findOne).toHaveBeenCalledWith({
        where: [
          { username: registerDto.username },
          { email: registerDto.email },
        ],
      });

      expect(encryptionAndHashService.hash).not.toHaveBeenCalled();

      expect(userService.save).not.toHaveBeenCalled();
    });
  });
});
