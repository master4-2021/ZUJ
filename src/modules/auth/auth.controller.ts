import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthorizedUser } from '../../common/decorators/authorizedUser';
import { SkipGuard } from '../../common/decorators/skipGuard';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local';
import { LoginPayload, RegisterPayload, ValidatedUser } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @SkipGuard()
  @Post('login')
  async login(@AuthorizedUser() user: ValidatedUser): Promise<LoginPayload> {
    return this.authService.login(user);
  }

  @SkipGuard()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RegisterPayload> {
    return this.authService.register(registerDto);
  }
}
