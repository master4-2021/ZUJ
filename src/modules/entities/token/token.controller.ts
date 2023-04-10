import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Public } from '../../../common/decorators/public';
import { Role, Roles } from '../../../common/decorators/roles';
import { RefreshTokenDto, RevokeTokenDto } from './token.dto';
import { TokenService } from './token.service';
import { TokenEntity } from './token.entity';
import { DeleteResult } from 'typeorm';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Public()
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<TokenEntity> {
    return await this.tokenService.refresh(body.refreshToken);
  }

  @Roles(Role.ADMIN)
  @Delete('revoke')
  async revokeToken(@Body() body: RevokeTokenDto): Promise<DeleteResult> {
    return await this.tokenService.revoke(body.userId);
  }
}
