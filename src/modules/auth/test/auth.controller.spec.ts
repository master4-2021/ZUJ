import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { RegisterDto } from '../auth.dto';
import { AuthService } from '../auth.service';
import { ValidatedUser, LoginPayload, RegisterPayload } from '../auth.types';
import {
  mockLoginPayload,
  mockRegisterDto,
  mockRegisterPayload,
  mockValidatedUser,
} from './auth.mock';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  let validatedUer: ValidatedUser;
  let registerDto: RegisterDto;
  let loginPayload: LoginPayload;
  let registerPayload: RegisterPayload;

  beforeEach(async () => {
    validatedUer = { ...mockValidatedUser };
    registerDto = { ...mockRegisterDto };
    loginPayload = { ...mockLoginPayload };
    registerPayload = { ...mockRegisterPayload };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((target) => {
        if (target === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(registerPayload),
            login: jest.fn().mockResolvedValue(loginPayload),
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

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should return a register payload', async () => {
      expect(await authController.register(registerDto)).toStrictEqual(
        registerPayload,
      );

      expect(authService.register).toBeCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should return a login payload', async () => {
      expect(await authController.login(validatedUer)).toStrictEqual(
        loginPayload,
      );

      expect(authService.login).toBeCalledWith(validatedUer);
    });
  });
});
