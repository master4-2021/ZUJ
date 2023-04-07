import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { REFRESH_JWT_TOKEN, JWT_TOKEN } from '../../../common/constants';
import { JwtPayload, ValidatedUser } from '../../auth/types';
import { BaseService } from '../../base/base.service';
import { BusinessException } from '../../../common/exceptions';
import {
  ErrorMessageEnum,
  REFRESH_TOKEN_ERROR,
} from '../../../common/constants/errors';
import { LoggerService } from '../../logger/logger.service';
import { TokenEntity } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService extends BaseService<LoggerService, TokenEntity> {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    @Inject(JWT_TOKEN)
    private readonly jwtService: JwtService,
    @Inject(REFRESH_JWT_TOKEN)
    private readonly refreshJwtService: JwtService,
    private readonly configService: ConfigService,
    logger: LoggerService,
  ) {
    super(tokenRepository, logger);
  }

  async refresh(refreshToken: string): Promise<TokenEntity> {
    let decoded: JwtPayload;
    try {
      decoded = await this.refreshJwtService.verifyAsync(refreshToken);
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        throw new BusinessException(
          REFRESH_TOKEN_ERROR,
          ErrorMessageEnum.refreshTokenExpired,
        );
      }
      throw new BusinessException(
        REFRESH_TOKEN_ERROR,
        ErrorMessageEnum.invalidRefreshToken,
      );
    }
    const tokenRecord = await this.findOne({
      where: {
        userId: decoded.sub,
      },
    });

    if (!tokenRecord || tokenRecord.refreshExpiresIn < new Date()) {
      throw new BusinessException(
        REFRESH_TOKEN_ERROR,
        ErrorMessageEnum.invalidRefreshToken,
      );
    }

    const newAccessToken = this.jwtService.sign({
      username: decoded.username,
      sub: decoded.sub,
      role: decoded.role,
    });

    return await this.updateById(tokenRecord.id, {
      accessToken: newAccessToken,
    });
  }

  async revoke(userId: string): Promise<DeleteResult> {
    const tokenRecord = await this.findOne({ where: { userId } });
    if (!tokenRecord) {
      return { raw: null, affected: 0 };
    }

    return this.deleteById(tokenRecord.id);
  }

  async createToken(tokenDto: ValidatedUser): Promise<TokenEntity> {
    await this.revoke(tokenDto.userId);

    const payload: JwtPayload = {
      username: tokenDto.username,
      role: tokenDto.role,
      sub: tokenDto.userId,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.refreshJwtService.sign(payload);

    return await this.save({
      accessToken,
      refreshToken,
      userId: tokenDto.userId,
      refreshExpiresIn: new Date(
        Date.now() +
          this.configService.get<number>('jwt.refreshExpiresIn') * 1000,
      ),
    });
  }

  async verifyAccessToken(accessToken: string): Promise<boolean> {
    const tokenRecord = await this.findOne({
      where: {
        accessToken,
      },
    });

    if (tokenRecord?.accessToken !== accessToken) {
      return false;
    }

    return true;
  }
}
