import { TestingModule, Test } from '@nestjs/testing';
import { RefreshTokenEntity } from '../../src/modules/entities/refreshToken/refreshToken.entity';
import { UserEntity } from '../../src/modules/entities/user/user.entity';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { RegisterDto } from '../../src/modules/auth/auth.dto';
import { AuthService } from '../../src/modules/auth/auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  mockDeleteResult,
  mockRefreshToken,
  mockRefreshTokenPayload,
  mockUser,
} from '../mock/output.mock';
import { ValidatedUser } from '../../src/modules/auth/types';
import { mockRegisterDto, mockValidatedUser } from '../mock/input.mock';
import { RefreshTokenPayload } from '../../src/modules/entities/refreshToken/types';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  let registerDto: RegisterDto;
  let user: UserEntity;
  let refreshToken: RefreshTokenEntity;
  let validatedUser: ValidatedUser;
  let refreshTokenPayload: RefreshTokenPayload;

  beforeEach(async () => {
    registerDto = mockRegisterDto;
    user = mockUser;
    refreshToken = mockRefreshToken;
    validatedUser = mockValidatedUser;
    refreshTokenPayload = mockRefreshTokenPayload;
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((target) => {
        if (target === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(user),
            login: jest.fn().mockResolvedValue(refreshTokenPayload),
            logout: jest.fn().mockResolvedValue(refreshToken),
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

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should return an user', async () => {
      expect(await authController.register(registerDto)).toBe(user);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should return token when login', async () => {
      expect(await authController.login(validatedUser)).toBe(
        refreshTokenPayload,
      );

      expect(authService.login).toBeCalledWith(validatedUser);
    });

    it('should return delete result when logout', async () => {
      expect(await authController.logout(validatedUser)).toBe(refreshToken);

      expect(authService.logout).toHaveBeenCalledWith(validatedUser.userId);
    });
  });
});
