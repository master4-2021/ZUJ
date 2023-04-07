import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RevokeTokenDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
