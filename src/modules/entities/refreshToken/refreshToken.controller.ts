import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Public } from '../../../common/decorators/public';
import { Role, Roles } from '../../../common/decorators/roles';
import { RefreshTokenDto, RevokeRefreshTokenDto } from './refreshToken.dto';
import { RefreshTokenService } from './refreshToken.service';
import { RefreshTokenPayload, RevokeTokenPayload } from './refreshToken.types';

@Controller('token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Public()
  @Post('refresh')
  async refreshToken(
    @Body() body: RefreshTokenDto,
  ): Promise<RefreshTokenPayload> {
    return await this.refreshTokenService.refresh(body.refreshToken);
  }

  @Roles(Role.ADMIN)
  @Delete('revoke')
  async revokeToken(
    @Body() body: RevokeRefreshTokenDto,
  ): Promise<RevokeTokenPayload> {
    return await this.refreshTokenService.revoke(body.userId);
  }
}
