import { RefreshTokenEntity } from './refreshToken.entity';

export type RefreshTokenPayload = RefreshTokenEntity & {
  accessToken: string;
};

export type RevokeTokenPayload = {
  refreshExpiresIn: Date;
};
