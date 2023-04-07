import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../entities/user/user.module';
import { LocalStrategy } from './strategies/localStrategy';
import { JwtStrategy } from './strategies/jwtStrategy';
import { TokenModule } from '../entities/token/token.module';
import { EncryptionAndHashModule } from '../encryptionAndHash/encryptionAndHash.module';
import { AuthController } from './auth.controller';
import { TokenJwtModule } from '../jwt/token.jwt.module';
import { JwtAuthGuard } from './guards/jwt';
import { LocalAuthGuard } from './guards/local';
import { RoleGuard } from './guards/role';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TokenModule,
    TokenJwtModule,
    EncryptionAndHashModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    RoleGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
