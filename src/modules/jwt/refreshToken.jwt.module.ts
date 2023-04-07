import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { REFRESH_JWT_TOKEN } from '../../common/constants';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.refreshSecret'),
        signOptions: {
          expiresIn: configService.get<number>('jwt.refreshExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: REFRESH_JWT_TOKEN,
      useFactory: (jwtService: JwtService) => jwtService,
      inject: [JwtService],
    },
  ],
  exports: [REFRESH_JWT_TOKEN],
})
export class RefreshTokenJwtModule {}
