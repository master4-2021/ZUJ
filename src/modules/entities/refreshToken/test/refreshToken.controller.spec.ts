import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenController } from '../refreshToken.controller';
import { RefreshTokenDto, RevokeRefreshTokenDto } from '../refreshToken.dto';
import { RefreshTokenService } from '../refreshToken.service';
import { RefreshTokenPayload, RevokeTokenPayload } from '../refreshToken.types';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  mockRefreshTokenDto,
  mockRevokeTokenDto,
  mockRefreshTokenPayload,
  mockRevokeTokenPayload,
} from '../test/refreshToken.mock';

const moduleMocker = new ModuleMocker(global);

describe('RefreshTokencontroller', () => {
  let refreshTokenController: RefreshTokenController;
  let refreshTokenService: RefreshTokenService;

  let refreshTokenDto: RefreshTokenDto;
  let revokeRefreshTokenDto: RevokeRefreshTokenDto;
  let refreshTokenPayload: RefreshTokenPayload;
  let revokeTokenPayload: RevokeTokenPayload;

  beforeEach(async () => {
    refreshTokenDto = { ...mockRefreshTokenDto };
    revokeRefreshTokenDto = { ...mockRevokeTokenDto };
    refreshTokenPayload = { ...mockRefreshTokenPayload };
    revokeTokenPayload = { ...mockRevokeTokenPayload };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
    })
      .useMocker((target) => {
        if (target === RefreshTokenService) {
          return {
            refresh: jest.fn().mockResolvedValue(refreshTokenPayload),
            revoke: jest.fn().mockResolvedValue(revokeTokenPayload),
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

    refreshTokenController = app.get<RefreshTokenController>(
      RefreshTokenController,
    );
    refreshTokenService = app.get<RefreshTokenService>(RefreshTokenService);
  });

  describe('refreshToken', () => {
    it('should return a refresh token payload', async () => {
      expect(
        await refreshTokenController.refreshToken(
          refreshTokenDto,
          'Bearer accessToken',
        ),
      ).toStrictEqual(refreshTokenPayload);

      expect(refreshTokenService.refresh).toBeCalledWith(
        'accessToken',
        refreshTokenDto.refreshToken,
      );
    });
  });

  describe('revokeToken', () => {
    it('should return a revoke token payload', async () => {
      expect(
        await refreshTokenController.revokeToken(revokeRefreshTokenDto),
      ).toStrictEqual(revokeTokenPayload);

      expect(refreshTokenService.revoke).toBeCalledWith(
        revokeRefreshTokenDto.userId,
      );
    });
  });
});
