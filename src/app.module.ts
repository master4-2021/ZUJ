import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ErrorFilter } from './common/filters/error';
import { CorrelationIdMiddleware } from './common/middlewares/correlationId';
import { ConfigModule } from './modules/config/config.module';
import { CrudModule } from './modules/entities/crud/crud.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/entities/token/token.module';
import { UserModule } from './modules/entities/user/user.module';
import { TokenJwtModule } from './modules/jwt/token.jwt.module';
import { RefreshTokenJwtModule } from './modules/jwt/refreshToken.jwt.module';
import { TransformResponseInterceptor } from './common/interceptors/response';
import { DatabaseModule } from './modules/database';
import { EncryptionAndHashModule } from './modules/encryptionAndHash/encryptionAndHash.module';
import { RequestContextMiddleware } from './common/middlewares/context/contextMiddleware';
import { RoleGuard } from './modules/auth/guards/role';
import { JwtAuthGuard } from './modules/auth/guards/jwt';
import { LoggerModule } from './modules/logger/logger.module';
import { ValidationError } from 'class-validator';
import { VALIDATION_ERROR } from './common/constants/errors';
import { BusinessException } from './common/exceptions';
import { FilterModule } from './modules/filter/filter.module';
import { LoggingInterceptor } from './common/interceptors/logging';
import { HealthModule } from './modules/health/health.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TokenJwtModule,
    RefreshTokenJwtModule,
    UserModule,
    CrudModule,
    AuthModule,
    TokenModule,
    EncryptionAndHashModule,
    LoggerModule,
    FilterModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          exceptionFactory: (errors: ValidationError[]) =>
            new BusinessException(VALIDATION_ERROR(errors), null),
        }),
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
