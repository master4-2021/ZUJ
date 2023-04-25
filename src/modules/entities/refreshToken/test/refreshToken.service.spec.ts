import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtPayload, ValidatedUser } from '../../../auth/auth.types';
import { EncryptionAndHashService } from '../../../encryptionAndHash/encrypttionAndHash.service';
import { RefreshTokenEntity } from '../refreshToken.entity';
import { RefreshTokenService } from '../refreshToken.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { RefreshTokenPayload, RevokeTokenPayload } from '../refreshToken.types';
import { mockRepository } from '../../../database/test/database.service.mock';
import { JWT_TOKEN, REFRESH_JWT_TOKEN } from '../../../../common/constants';
import { mockJwtService } from '../../../jwt/test/jwt.service.mock';
import { JwtService } from '@nestjs/jwt';
import {
  mockJwtPayload,
  mockRefreshTokenPayload,
  mockRefreshTokenRecord,
  mockRevokeTokenPayload,
  mockValidatedUser,
} from './refreshToken.mock';
import { DateTime } from 'luxon';
import { BusinessException } from '../../../../common/exceptions';
import { ErrorMessageEnum } from '../../../../common/types';
import { HttpStatus } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('RefreshTokenService', () => {
  let refreshTokenService: RefreshTokenService;
  let encryptionAndHashService: EncryptionAndHashService;

  let refreshToken: string;
  let accessToken: string;
  let encryptedRefreshToken: string;
  let refreshTokenPayload: RefreshTokenPayload;
  let revokeTokenPayload: RevokeTokenPayload;
  let refreshTokenRecord: RefreshTokenEntity;
  let jwtPayload: JwtPayload;
  let validatedUser: ValidatedUser;

  beforeEach(async () => {
    refreshToken = 'refreshToken';
    accessToken = 'accessToken';
    encryptedRefreshToken = 'encryptedRefreshToken';
    refreshTokenPayload = { ...mockRefreshTokenPayload };
    refreshTokenRecord = { ...mockRefreshTokenRecord };
    jwtPayload = { ...mockJwtPayload };
    validatedUser = { ...mockValidatedUser };
    revokeTokenPayload = { ...mockRevokeTokenPayload };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'jwt.refreshExpiresIn') {
                return 3600;
              }
              if (key === 'jwt.refreshExpiresIn') {
                return 30 * 24 * 3600;
              }
            }),
          },
        },
        {
          provide: JWT_TOKEN,
          useValue: mockJwtService,
        },
        {
          provide: REFRESH_JWT_TOKEN,
          useValue: mockJwtService,
        },
      ],
    })
      .useMocker((target) => {
        if (target === EncryptionAndHashService) {
          return {
            encrypt: jest.fn().mockResolvedValue(encryptedRefreshToken),
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
    encryptionAndHashService = app.get<EncryptionAndHashService>(
      EncryptionAndHashService,
    );
  });

  it('should be defined', () => {
    expect(refreshTokenService).toBeDefined();
  });

  describe('refresh', () => {
    it('should return refresh token payload', async () => {
      jest
        .spyOn(refreshTokenService, 'findOne')
        .mockResolvedValue(refreshTokenRecord);
      jest.spyOn(refreshTokenService, 'updateById').mockResolvedValue({
        ...refreshTokenRecord,
        refreshExpiresIn: refreshTokenPayload.refreshExpiresIn,
      });
      jest.spyOn(refreshTokenService, 'verify').mockResolvedValue(jwtPayload);
      jest.spyOn(refreshTokenService, 'sign').mockResolvedValue(accessToken);

      expect(await refreshTokenService.refresh(refreshToken)).toStrictEqual(
        refreshTokenPayload,
      );

      expect(refreshTokenService.verify).toHaveBeenCalledWith(
        refreshToken,
        'refresh',
        {
          ignoreExpiration: true,
        },
      );

      expect(refreshTokenService.findOne).toHaveBeenCalledWith({
        where: [{ userId: jwtPayload.sub }],
      });

      expect(encryptionAndHashService.encrypt).toHaveBeenCalledWith(
        refreshToken,
      );

      expect(refreshTokenService.sign).toHaveBeenCalledWith(
        jwtPayload,
        'access',
      );

      expect(refreshTokenService.updateById).toHaveBeenCalledWith(
        refreshTokenRecord.id,
        {
          refreshExpiresIn: expect.any(Date),
        },
      );
    });

    it.each([null, { ...mockRefreshTokenRecord }])(
      'should throw error if refresh token is not found or invalid',
      async (item) => {
        const error = new BusinessException(
          ErrorMessageEnum.invalidRefreshToken,
          HttpStatus.BAD_REQUEST,
        );

        jest.spyOn(refreshTokenService, 'verify').mockResolvedValue(jwtPayload);
        jest.spyOn(refreshTokenService, 'findOne').mockResolvedValue(item);
        jest.spyOn(refreshTokenService, 'sign').mockResolvedValue(null);
        jest.spyOn(refreshTokenService, 'updateById').mockResolvedValue(null);
        jest
          .spyOn(encryptionAndHashService, 'encrypt')
          .mockResolvedValue('anotherDifferentEncryptedRefreshToken');

        await expect(refreshTokenService.refresh(refreshToken)).rejects.toThrow(
          error,
        );

        expect(refreshTokenService.verify).toHaveBeenCalledWith(
          refreshToken,
          'refresh',
          {
            ignoreExpiration: true,
          },
        );

        expect(refreshTokenService.findOne).toHaveBeenCalledWith({
          where: [{ userId: jwtPayload.sub }],
        });

        expect(encryptionAndHashService.encrypt).toHaveBeenCalledWith(
          refreshToken,
        );

        expect(refreshTokenService.sign).not.toHaveBeenCalled();

        expect(refreshTokenService.updateById).not.toHaveBeenCalled();
      },
    );

    it('should throw error if refresh token is expired', async () => {
      const expiredRefreshTokenRecord = {
        ...refreshTokenRecord,
        refreshExpiresIn: DateTime.now().minus({ days: 1 }).toJSDate(),
      };
      const error = new BusinessException(
        ErrorMessageEnum.refreshTokenExpired,
        HttpStatus.BAD_REQUEST,
      );

      jest.spyOn(refreshTokenService, 'verify').mockResolvedValue(jwtPayload);
      jest
        .spyOn(refreshTokenService, 'findOne')
        .mockResolvedValue(expiredRefreshTokenRecord);
      jest.spyOn(refreshTokenService, 'sign').mockResolvedValue(null);
      jest.spyOn(refreshTokenService, 'updateById').mockResolvedValue(null);

      await expect(refreshTokenService.refresh(refreshToken)).rejects.toThrow(
        error,
      );

      expect(refreshTokenService.verify).toHaveBeenCalledWith(
        refreshToken,
        'refresh',
        {
          ignoreExpiration: true,
        },
      );

      expect(refreshTokenService.findOne).toHaveBeenCalledWith({
        where: [{ userId: jwtPayload.sub }],
      });

      expect(encryptionAndHashService.encrypt).toHaveBeenCalledWith(
        refreshToken,
      );

      expect(refreshTokenService.sign).not.toHaveBeenCalled();

      expect(refreshTokenService.updateById).not.toHaveBeenCalled();
    });
  });

  describe('revoke', () => {
    it('should return revoke token payload', async () => {
      jest.spyOn(refreshTokenService, 'updateOne').mockResolvedValue({
        ...refreshTokenRecord,
        refreshExpiresIn: revokeTokenPayload.refreshExpiresIn,
      });

      expect(
        await refreshTokenService.revoke(refreshTokenRecord.userId),
      ).toStrictEqual(revokeTokenPayload);

      expect(refreshTokenService.updateOne).toHaveBeenCalledWith(
        {
          where: [{ userId: refreshTokenRecord.userId }],
        },
        { refreshExpiresIn: expect.any(Date) },
      );
    });
  });

  describe('createToken', () => {
    it.each([null, { ...mockRefreshTokenRecord }])(
      'should return token payload',
      async (item) => {
        jest.spyOn(refreshTokenService, 'findOne').mockResolvedValue(item);
        jest.spyOn(refreshTokenService, 'save').mockResolvedValue({
          ...refreshTokenRecord,
          refreshExpiresIn: refreshTokenPayload.refreshExpiresIn,
        });
        jest.spyOn(refreshTokenService, 'updateById').mockResolvedValue({
          ...refreshTokenRecord,
          refreshExpiresIn: refreshTokenPayload.refreshExpiresIn,
        });
        jest
          .spyOn(refreshTokenService, 'sign')
          .mockImplementation((_payload, type) => {
            return type === 'refresh'
              ? Promise.resolve(refreshToken)
              : Promise.resolve(accessToken);
          });

        expect(
          await refreshTokenService.createToken(validatedUser),
        ).toStrictEqual(refreshTokenPayload);

        expect(refreshTokenService.findOne).toHaveBeenCalledWith({
          where: [{ userId: validatedUser.userId }],
        });

        expect(refreshTokenService.sign).toHaveBeenCalledWith(
          {
            sub: validatedUser.userId,
            username: validatedUser.username,
            role: validatedUser.role,
          },
          'refresh',
        );

        expect(refreshTokenService.sign).toHaveBeenCalledWith(
          {
            sub: validatedUser.userId,
            username: validatedUser.username,
            role: validatedUser.role,
          },
          'access',
        );

        if (!item) {
          expect(refreshTokenService.save).toHaveBeenCalledWith({
            userId: validatedUser.userId,
            refreshToken: encryptedRefreshToken,
            refreshExpiresIn: expect.any(Date),
          });
        } else {
          expect(refreshTokenService.updateById).toHaveBeenCalledWith(item.id, {
            refreshToken: encryptedRefreshToken,
            refreshExpiresIn: expect.any(Date),
          });
        }
      },
    );
  });
});
