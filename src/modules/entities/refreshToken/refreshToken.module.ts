import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenJwtModule } from '../../jwt/refreshToken.jwt.module';
import { TokenJwtModule } from '../../jwt/token.jwt.module';
import { RefreshTokenController } from './refreshToken.controller';
import { RefreshTokenEntity } from './refreshToken.entity';
import { RefreshTokenService } from './refreshToken.service';
import { EncryptionAndHashModule } from '../../encryptionAndHash/encryptionAndHash.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    TokenJwtModule,
    RefreshTokenJwtModule,
    EncryptionAndHashModule,
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
