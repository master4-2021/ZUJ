import { ConfigService } from '@nestjs/config';
import { TokenService } from '../../src/modules/entities/refreshToken/refreshToken.service';
import { ValidatedUser } from '../../src/modules/auth/types';
import { mockValidatedUser } from '../mock/input.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { JWT_TOKEN, REFRESH_JWT_TOKEN } from '../../src/common/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenEntity } from '../../src/modules/entities/refreshToken/refreshToken.entity';
import mockRepository from '../mock/repository.mock';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { mockJwtPayload, mockToken } from '../mock/output.mock';
import { TokenJwtModule } from '../../src/modules/jwt/token.jwt.module';
import { RefreshTokenJwtModule } from '../../src/modules/jwt/refreshToken.jwt.module';
import mockJwtService from '../mock/jwtService.mock';

const moduleMocker = new ModuleMocker(global);

describe('TokenService', () => {
  let tokenService: TokenService;
  let configService: ConfigService;
  let validatedUser: ValidatedUser;
  let refreshToken: string;
  let token: TokenEntity;

  beforeEach(async () => {
    validatedUser = mockValidatedUser;
    refreshToken = 'refreshToken';
    token = mockToken;

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JWT_TOKEN, useValue: mockJwtService },
        { provide: REFRESH_JWT_TOKEN, useValue: mockJwtService },
        { provide: getRepositoryToken(TokenEntity), useValue: mockRepository },
      ],
    })
      .useMocker((target) => {
        if (typeof target === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            target,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    tokenService = app.get<TokenService>(TokenService);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe('refresh', () => {
    it('should return updated token record', async () => {
      const updatedToken = { ...token, accessToken: 'token' };
      jest.spyOn(tokenService, 'findOne').mockResolvedValue(token);
      jest.spyOn(tokenService, 'updateById').mockResolvedValue(updatedToken);
      jest
        .spyOn(mockJwtService, 'verifyAsync')
        .mockResolvedValue(mockJwtPayload);
      jest
        .spyOn(mockJwtService, 'sign')
        .mockReturnValue(updatedToken.accessToken);

      expect(await tokenService.refresh(refreshToken)).toEqual(updatedToken);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);

      expect(tokenService.findOne).toHaveBeenCalledWith({
        where: { userId: mockJwtPayload.sub },
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith(mockJwtPayload);

      expect(tokenService.updateById).toHaveBeenCalledWith(token.id, {
        accessToken: updatedToken.accessToken,
      });
    });

    it('should throw error if refresh token expired', async () => {
      jest.spyOn(mockJwtService, 'verifyAsync').mockRejectedValue('error');

      await expect(tokenService.refresh(refreshToken)).rejects.toThrow('error');

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);
    });
  });
});
