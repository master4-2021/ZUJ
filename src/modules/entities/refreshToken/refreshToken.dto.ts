import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RevokeRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
