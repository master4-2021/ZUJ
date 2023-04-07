import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_TOKEN } from '../../common/constants';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<number>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: JWT_TOKEN,
      useFactory: (jwtService: JwtService) => jwtService,
      inject: [JwtService],
    },
  ],
  exports: [JWT_TOKEN],
})
export class TokenJwtModule {}
