import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { REFRESH_JWT_TOKEN, JWT_TOKEN } from '../../../common/constants';
import { JwtPayload, ValidatedUser } from '../../auth/types';
import { BaseService } from '../../base/base.service';
import { BusinessException } from '../../../common/exceptions';
import {
  BAD_REQUEST,
  ErrorMessageEnum,
} from '../../../common/constants/errors';
import { RefreshTokenEntity } from './refreshToken.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { RefreshTokenPayload } from './types';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';

@Injectable()
export class RefreshTokenService extends BaseService<RefreshTokenEntity> {
  constructor(
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
    const decoded = await this.refreshJwtService.verifyAsync(refreshToken, {
      ignoreExpiration: true,
    });

    const tokenRecord = await this.findOne({
      where: {
        userId: decoded.sub,
      },
    });

    if (
      tokenRecord?.refreshToken !==
      this.encryptionAndHashService.encrypt(refreshToken)
    ) {
      throw new BusinessException(
        BAD_REQUEST,
        ErrorMessageEnum.invalidRefreshToken,
      );
    }

    if (tokenRecord.refreshExpiresIn < DateTime.now().toJSDate()) {
      throw new BusinessException(
        BAD_REQUEST,
        ErrorMessageEnum.refreshTokenExpired,
      );
    }

    const newAccessToken = this.jwtService.sign({
      username: decoded.username,
      sub: decoded.sub,
      role: decoded.role,
    });

    const updated = await this.updateById(tokenRecord.id, {
      refreshExpiresIn: this.updateRefreshTokenExpiry(),
    });

    return { ...updated, refreshToken, accessToken: newAccessToken };
  }

  async revoke(userId: string): Promise<RefreshTokenEntity> {
    return this.updateOne(
      { where: { userId } },
      { refreshExpiresIn: this.updateRefreshTokenExpiry(true) },
    );
  }

  async createToken(
    validatedUser: ValidatedUser,
  ): Promise<RefreshTokenPayload> {
    const payload: JwtPayload = {
      username: validatedUser.username,
      role: validatedUser.role,
      sub: validatedUser.userId,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.refreshJwtService.sign(payload);

    const encrypted = this.encryptionAndHashService.encrypt(refreshToken);

    const created = await this.save({
      refreshToken: encrypted,
      userId: validatedUser.userId,
      refreshExpiresIn: this.updateRefreshTokenExpiry(),
    });

    return { ...created, refreshToken: refreshToken, accessToken };
  }

  private updateRefreshTokenExpiry(revoke = false) {
    if (revoke) {
      return DateTime.fromMillis(
        DateTime.now().millisecond -
          this.configService.get<number>('jwt.refreshExpiresIn') * 1000,
      ).toJSDate();
    }
    return DateTime.fromMillis(
      DateTime.now().millisecond +
        this.configService.get<number>('jwt.refreshExpiresIn') * 1000,
    ).toJSDate();
  }
}
