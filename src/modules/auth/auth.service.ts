import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import {
  ErrorMessageEnum,
  UNAUTHORIZED,
  USER_EXISTED,
} from '../../common/constants/errors';
import { Role } from '../../common/decorators/role';
import { BusinessException } from '../../common/exceptions';
import { EncryptionAndHashService } from '../encryptionAndHash/encrypttionAndHash.service';
import { TokenEntity } from '../entities/token/token.entity';
import { TokenService } from '../entities/token/token.service';
import { UserEntity } from '../entities/user/user.entity';
import { UserService } from '../entities/user/user.service';
import { RegisterDto } from './auth.dto';
import { ValidatedUser } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
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

  async validateAccessToken(accessToken: string): Promise<boolean> {
    return this.tokenService.verifyAccessToken(accessToken);
  }

  async login(loginDto: ValidatedUser): Promise<TokenEntity> {
    return await this.tokenService.createToken(loginDto);
  }

  async logout(userId: string): Promise<DeleteResult> {
    return await this.tokenService.revoke(userId);
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const { username, email, password } = registerDto;
    let where: FindOptionsWhere<UserEntity>[] = [{ username }];
    if (email) {
      where = [{ username }, { email }];
    }
    const user = await this.usersService.findOne({ where });
    if (user) {
      throw new BusinessException(USER_EXISTED, ErrorMessageEnum.userExisted);
    }
    const hashedPassword = await this.encryptionAndHashService.hash(password);

    return await this.usersService.save({
      ...registerDto,
      password: hashedPassword,
      role: Role.USER,
    });
  }
}
