import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from '../../src/modules/entities/refreshToken/refreshToken.service';
import { ValidatedUser } from '../../src/modules/auth/types';
import { mockValidatedUser } from '../mock/input.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { JWT_TOKEN, REFRESH_JWT_TOKEN } from '../../src/common/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../../src/modules/entities/refreshToken/refreshToken.entity';
import mockRepository from '../mock/repository.mock';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  mockJwtPayload,
  mockRefreshToken,
  mockRefreshTokenPayload,
} from '../mock/output.mock';
import mockJwtService from '../mock/jwtService.mock';
import { RefreshTokenPayload } from '../../src/modules/entities/refreshToken/types';
import { DateTime } from 'luxon';
import { EncryptionAndHashService } from '../../src/modules/encryptionAndHash/encrypttionAndHash.service';

const moduleMocker = new ModuleMocker(global);

describe('RefreshTokenService', () => {
  let refreshTokenService: RefreshTokenService;
  let configService: ConfigService;
  let encryptionAndHashService: EncryptionAndHashService;

  let refreshToken: RefreshTokenEntity;
  let refreshTokenPayload: RefreshTokenPayload;

  beforeEach(async () => {
    refreshToken = mockRefreshToken;
    refreshTokenPayload = mockRefreshTokenPayload;

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: JWT_TOKEN, useValue: mockJwtService },
        { provide: REFRESH_JWT_TOKEN, useValue: mockJwtService },
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useValue: mockRepository,
        },
      ],
    })
      .useMocker((target) => {
        if (target === EncryptionAndHashService) {
          return {
            encrypt: jest.fn().mockReturnValue(refreshToken.refreshToken),
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

    refreshTokenService = app.get<RefreshTokenService>(RefreshTokenService);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe('refresh', () => {
    it('should return updated refresh token record', async () => {
      const input = 'refreshToken';
      const output = { ...refreshTokenPayload };
      const updatedRefreshToken = {
        ...refreshToken,
        refreshExpiresIn: refreshTokenPayload.refreshExpiresIn,
      };
      jest
        .spyOn(refreshTokenService, 'findOne')
        .mockResolvedValue(refreshToken);
      jest
        .spyOn(refreshTokenService, 'updateById')
        .mockResolvedValue(updatedRefreshToken);
      jest
        .spyOn(mockJwtService, 'verifyAsync')
        .mockResolvedValue(mockJwtPayload);
      jest
        .spyOn(mockJwtService, 'sign')
        .mockReturnValue(refreshTokenPayload.accessToken);

      expect(await refreshTokenService.refresh(input)).toEqual(output);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(input);

      expect(refreshTokenService.findOne).toHaveBeenCalledWith({
        where: { userId: mockJwtPayload.sub },
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith(mockJwtPayload);

      // expect(refreshTokenService.updateById).toHaveBeenCalledWith(token.id, {
      //   accessToken: updatedToken.accessToken,
      // });
    });

    // it('should throw error if refresh token expired', async () => {
    //   jest.spyOn(mockJwtService, 'verifyAsync').mockRejectedValue('error');

    //   await expect(refreshTokenService.refresh(refreshToken)).rejects.toThrow(
    //     'error',
    //   );

    //   expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);
    // });
  });
});
