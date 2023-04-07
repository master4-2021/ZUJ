import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenJwtModule } from '../../jwt/refreshToken.jwt.module';
import { TokenJwtModule } from '../../jwt/token.jwt.module';
import { TokenController } from './token.controller';
import { TokenEntity } from './token.entity';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    TokenJwtModule,
    RefreshTokenJwtModule,
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
