import { TestingModule, Test } from '@nestjs/testing';
import { DeleteResult } from 'typeorm';
import { RegisterDto } from '../../src/modules/auth/auth.dto';
import { AuthService } from '../../src/modules/auth/auth.service';
import { ValidatedUser } from '../../src/modules/auth/types';
import { TokenEntity } from '../../src/modules/entities/refreshToken/refreshToken.entity';
import { UserEntity } from '../../src/modules/entities/user/user.entity';
import { mockUser, mockToken, mockDeleteResult } from '../mock/output.mock';
import { UserService } from '../../src/modules/entities/user/user.service';
import { TokenService } from '../../src/modules/entities/refreshToken/refreshToken.service';
import { EncryptionAndHashService } from '../../src/modules/encryptionAndHash/encrypttionAndHash.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { mockRegisterDto, mockValidatedUser } from '../mock/input.mock';
import { UnauthorizedException } from '@nestjs/common';
import {
  UNAUTHORIZED,
  ErrorMessageEnum,
  CONFLICT_ERROR,
} from '../../src/common/constants/errors';
import { Role } from '../../src/common/decorators/roles';
import { BusinessException } from '../../src/common/exceptions';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let registerDto: RegisterDto;
  let user: UserEntity;
  let token: TokenEntity;
  let deleteResult: DeleteResult;
  let validatedUser: ValidatedUser;

  let authService: AuthService;
  let encryptionAndHashService: EncryptionAndHashService;
  let userService: UserService;
  let tokenService: TokenService;

  beforeEach(async () => {
    registerDto = mockRegisterDto;
    user = mockUser;
    token = mockToken;
    validatedUser = mockValidatedUser;
    deleteResult = mockDeleteResult;

    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((target) => {
        if (target === UserService) {
          return {
            findOne: jest.fn().mockResolvedValue(user),
            save: jest.fn().mockResolvedValue(user),
          };
        }

        if (target === TokenService) {
          return {
            verifyAccessToken: jest.fn().mockResolvedValue(true),
            createToken: jest.fn().mockResolvedValue(token),
            revoke: jest.fn().mockResolvedValue(deleteResult),
          };
        }

        if (target === EncryptionAndHashService) {
          return {
            compare: jest.fn().mockResolvedValue(true),
            hash: jest.fn().mockResolvedValue(user.password),
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
    tokenService = app.get<TokenService>(TokenService);
  });

  describe('validateUser', () => {
    const input = {
      username: 'username',
      password: 'password',
    };
    it('should return an validated user', async () => {
      expect(
        await authService.validateUser(input.username, input.password),
      ).toStrictEqual(validatedUser);

      expect(userService.findOne).toHaveBeenCalledWith({
        where: { username: input.username },
      });

      expect(encryptionAndHashService.compare).toHaveBeenCalledTimes(1);
      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        input.password,
        user.password,
      );
    });

    it('should throw unauthorized error when user not found when validate user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      const error = new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.invalidCredentials],
      );

      await expect(
        authService.validateUser(input.username, input.password),
      ).rejects.toThrowError(error);

      expect(userService.findOne).toHaveBeenCalledWith({
        where: { username: input.username },
      });

      expect(encryptionAndHashService.compare).not.toHaveBeenCalled();
    });

    it('should throw unauthorized error when password not match when validate user', async () => {
      jest.spyOn(encryptionAndHashService, 'compare').mockResolvedValue(false);
      const error = new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.invalidCredentials],
      );

      await expect(
        authService.validateUser(input.username, input.password),
      ).rejects.toThrowError(error);

      expect(userService.findOne).toHaveBeenCalledWith({
        where: { username: input.username },
      });

      expect(encryptionAndHashService.compare).toHaveBeenCalledWith(
        input.password,
        user.password,
      );
    });
  });

  describe('validateAccessToken', () => {
    const accessToken = 'accessToken';

    it('should return true', async () => {
      expect(await authService.validateAccessToken(accessToken)).toBeTruthy();

      expect(tokenService.verifyAccessToken).toHaveBeenCalledWith(accessToken);
    });

    it('should return false', async () => {
      jest.spyOn(tokenService, 'verifyAccessToken').mockResolvedValue(false);

      expect(await authService.validateAccessToken(accessToken)).toBeFalsy();

      expect(tokenService.verifyAccessToken).toHaveBeenCalledWith(accessToken);
    });
  });

  describe('login', () => {
    it('should return token when login', async () => {
      expect(await authService.login(validatedUser)).toBe(token);

      expect(tokenService.createToken).toHaveBeenCalledWith(validatedUser);
    });
  });

  describe('logout', () => {
    it('should return deleteResult when logout', async () => {
      expect(await authService.logout(user.id)).toBe(deleteResult);

      expect(tokenService.revoke).toHaveBeenCalledWith(user.id);
    });
  });

  describe('register', () => {
    it('should return an user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      expect(await authService.register(registerDto)).toBe(user);

      expect(userService.findOne).toHaveBeenCalledWith({
        where: [
          { username: registerDto.username },
          { email: registerDto.email },
        ],
      });

      expect(encryptionAndHashService.hash).toHaveBeenCalledWith(
        registerDto.password,
      );

      expect(await encryptionAndHashService.hash(registerDto.password)).toBe(
        user.password,
      );

      expect(userService.save).toHaveBeenCalledWith({
        ...registerDto,
        password: user.password,
        role: Role.USER,
      });
    });

    it('should throw user existed error when register', async () => {
      const error = new BusinessException(
        CONFLICT_ERROR,
        ErrorMessageEnum.userExisted,
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
    });
  });
});
