import { TestingModule, Test } from '@nestjs/testing';
import { TokenEntity } from '../../src/modules/entities/token/token.entity';
import { UserEntity } from '../../src/modules/entities/user/user.entity';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { RegisterDto } from '../../src/modules/auth/auth.dto';
import { AuthService } from '../../src/modules/auth/auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  mockDeleteResult,
  mockRegisterDto,
  mockToken,
  mockUser,
  mockValidatedUser,
} from '../mock/data.mock';
import { ValidatedUser } from '../../src/modules/auth/types';
import { DeleteResult } from 'typeorm';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let registerDto: RegisterDto;
  let user: UserEntity;
  let token: TokenEntity;
  let deleteResult: DeleteResult;
  let validatedUser: ValidatedUser;

  beforeEach(async () => {
    registerDto = mockRegisterDto;
    user = mockUser;
    token = mockToken;
    validatedUser = mockValidatedUser;
    deleteResult = mockDeleteResult;
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((target) => {
        if (target === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(user),
            login: jest.fn().mockResolvedValue(token),
            logout: jest.fn().mockResolvedValue(deleteResult),
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
  });

  describe('register', () => {
    it('should return an user', async () => {
      expect(await authController.register(registerDto)).toBe(user);
    });

    it('should return token when login', async () => {
      expect(await authController.login(validatedUser)).toBe(token);
    });

    it('should return delete result when logout', async () => {
      expect(await authController.logout(validatedUser)).toBe(deleteResult);
    });
  });
});
