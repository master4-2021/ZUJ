import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthorizedUser } from '../../common/decorators/authorizedUser';
import { Public } from '../../common/decorators/public';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt';
import { LocalAuthGuard } from './guards/local';
import { ValidatedUser } from './types';
import { TokenEntity } from '../entities/token/token.entity';
import { UserEntity } from '../entities/user/user.entity';
import { DeleteResult } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@AuthorizedUser() user: ValidatedUser): Promise<TokenEntity> {
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@AuthorizedUser() user: ValidatedUser): Promise<DeleteResult> {
    return this.authService.logout(user.userId);
  }
}
