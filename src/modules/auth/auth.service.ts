import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import {
  CONFLICT_ERROR,
  ErrorMessageEnum,
  UNAUTHORIZED,
} from '../../common/constants/errors';
import { Role } from '../../common/decorators/roles';
import { BusinessException } from '../../common/exceptions';
import { EncryptionAndHashService } from '../encryptionAndHash/encrypttionAndHash.service';
import { RefreshTokenEntity } from '../entities/refreshToken/refreshToken.entity';
import { RefreshTokenService } from '../entities/refreshToken/refreshToken.service';
import { UserEntity } from '../entities/user/user.entity';
import { UserService } from '../entities/user/user.service';
import { RegisterDto } from './auth.dto';
import { ValidatedUser } from './types';
import { RefreshTokenPayload } from '../entities/refreshToken/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUser> {
    const user = await this.usersService.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.invalidCredentials],
      );
    }

    const isPasswordValid = await this.encryptionAndHashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        UNAUTHORIZED.messages[ErrorMessageEnum.invalidCredentials],
      );
    }
    return {
      username: user.username,
      userId: user.id,
      role: user.role,
    };
  }

  async login(validatedUser: ValidatedUser): Promise<RefreshTokenPayload> {
    return await this.refreshTokenService.createToken(validatedUser);
  }

  async logout(userId: string): Promise<RefreshTokenEntity> {
    return await this.refreshTokenService.revoke(userId);
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const { username, email, password } = registerDto;
    let where: FindOptionsWhere<UserEntity>[] = [{ username }];
    if (email) {
      where = [{ username }, { email }];
    }
    const user = await this.usersService.findOne({ where });
    if (user) {
      throw new BusinessException(CONFLICT_ERROR, ErrorMessageEnum.userExisted);
    }
    const hashedPassword = await this.encryptionAndHashService.hash(password);

    return await this.usersService.save({
      ...registerDto,
      password: hashedPassword,
      role: Role.USER,
    });
  }
}
