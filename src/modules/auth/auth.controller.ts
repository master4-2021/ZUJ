import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthorizedUser } from '../../common/decorators/authorizedUser';
import { Public } from '../../common/decorators/public';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt';
import { LocalAuthGuard } from './guards/local';
import { ValidatedUser } from './types';
import { RefreshTokenEntity } from '../entities/refreshToken/refreshToken.entity';
import { UserEntity } from '../entities/user/user.entity';
import { RefreshTokenPayload } from '../entities/refreshToken/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(
    @AuthorizedUser() user: ValidatedUser,
  ): Promise<RefreshTokenPayload> {
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @AuthorizedUser() user: ValidatedUser,
  ): Promise<RefreshTokenEntity> {
    return this.authService.logout(user.userId);
  }
}
