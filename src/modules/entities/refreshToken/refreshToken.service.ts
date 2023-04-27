import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { REFRESH_JWT_TOKEN, JWT_TOKEN } from '../../../common/constants';
import { JwtPayload, ValidatedUser } from '../../auth/auth.types';
import { BaseService } from '../../base/base.service';
import {
  BusinessException,
  TechnicalException,
} from '../../../common/exceptions';
import { RefreshTokenEntity } from './refreshToken.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { RefreshTokenPayload, RevokeTokenPayload } from './refreshToken.types';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { ErrorMessageEnum } from '../../../common/types';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class RefreshTokenService extends BaseService<RefreshTokenEntity> {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(RefreshTokenEntity)
    private readonly tokenRepository: Repository<RefreshTokenEntity>,
    @Inject(JWT_TOKEN)
    private readonly jwtService: JwtService,
    @Inject(REFRESH_JWT_TOKEN)
    private readonly refreshJwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {
    super(tokenRepository);
  }

  async refresh(refreshToken: string): Promise<RefreshTokenPayload> {
    const decoded = await this.verify(refreshToken, 'refresh', {
      ignoreExpiration: true,
    });

    const tokenRecord = await this.findOne({
      where: [
        {
          userId: decoded.sub,
        },
      ],
    });

    if (!tokenRecord) {
      throw new BusinessException(
        ErrorMessageEnum.invalidRefreshToken,
        HttpStatus.BAD_REQUEST,
      );
    }

    const decrypted = await this.encryptionAndHashService.decrypt(
      tokenRecord.refreshToken,
      tokenRecord.iv,
    );

    if (refreshToken !== decrypted) {
      throw new BusinessException(
        ErrorMessageEnum.invalidRefreshToken,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (tokenRecord.refreshExpiresIn < DateTime.now().toJSDate()) {
      throw new BusinessException(
        ErrorMessageEnum.refreshTokenExpired,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newAccessToken = await this.sign(
      {
        username: decoded.username,
        sub: decoded.sub,
        role: decoded.role,
      },
      'access',
    );

    const updated = await this.updateById(tokenRecord.id, {
      refreshExpiresIn: this.updateRefreshTokenExpiry(),
    });

    return { ...updated, refreshToken, accessToken: newAccessToken };
  }

  async revoke(userId: string): Promise<RevokeTokenPayload> {
    const updated = await this.updateOne(
      { where: [{ userId }] },
      { refreshExpiresIn: this.updateRefreshTokenExpiry(true) },
    );

    return {
      refreshExpiresIn: updated.refreshExpiresIn,
    };
  }

  async createToken(
    validatedUser: ValidatedUser,
  ): Promise<RefreshTokenPayload> {
    const payload: JwtPayload = {
      username: validatedUser.username,
      role: validatedUser.role,
      sub: validatedUser.userId,
    };

    const accessToken = await this.sign(payload, 'access');

    const refreshToken = await this.sign(payload, 'refresh');

    const { encryptedData, iv } = await this.encryptionAndHashService.encrypt(
      refreshToken,
    );

    const tokenRecord = await this.findOne({
      where: [{ userId: validatedUser.userId }],
    });

    let result: RefreshTokenEntity;

    if (!tokenRecord) {
      result = await this.save({
        refreshToken: encryptedData,
        iv,
        userId: validatedUser.userId,
        refreshExpiresIn: this.updateRefreshTokenExpiry(),
      });
    } else {
      result = await this.updateById(tokenRecord.id, {
        refreshToken: encryptedData,
        iv,
        refreshExpiresIn: this.updateRefreshTokenExpiry(),
      });
    }

    return { ...result, refreshToken: refreshToken, accessToken };
  }

  private updateRefreshTokenExpiry(revoke = false) {
    if (revoke) {
      return DateTime.fromMillis(
        DateTime.now().valueOf() -
          this.configService.get<number>('jwt.refreshExpiresIn') * 1000,
      ).toJSDate();
    }
    return DateTime.fromMillis(
      DateTime.now().valueOf() +
        this.configService.get<number>('jwt.refreshExpiresIn') * 1000,
    ).toJSDate();
  }

  async sign(
    payload: JwtPayload,
    type: 'refresh' | 'access',
    options: JwtSignOptions = {},
  ): Promise<string> {
    try {
      if (type === 'refresh') {
        return await this.refreshJwtService.signAsync(payload, options);
      }
      if (type === 'access') {
        return await this.jwtService.signAsync(payload, options);
      }
    } catch (error) {
      this.logger.error_(
        'Failed to sign JWT',
        error,
        RefreshTokenService.name,
        { payload },
      );
      throw new TechnicalException(
        ErrorMessageEnum.failedToSignJwt,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verify(
    token: string,
    type: 'refresh' | 'access',
    options: JwtVerifyOptions = {},
  ): Promise<JwtPayload> {
    try {
      if (type === 'refresh') {
        return await this.refreshJwtService.verifyAsync(token, options);
      }
      if (type === 'access') {
        return await this.jwtService.verifyAsync(token, options);
      }
    } catch (error) {
      this.logger.error_(
        'Failed to verify JWT',
        error,
        RefreshTokenService.name,
        { token },
      );
      throw new BusinessException(
        type === 'access'
          ? ErrorMessageEnum.invalidAccessToken
          : ErrorMessageEnum.invalidRefreshToken,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
