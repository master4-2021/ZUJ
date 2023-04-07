import { Module } from '@nestjs/common';
import { ConfigModule as NestJSConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configurations from './configurations';

@Module({
  imports: [
    NestJSConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configurations],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        PG_URL: Joi.string().required(),
        PG_HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        PG_USERNAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_DATABASE: Joi.string().required(),
        PG_SYCRONIZE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.number().required(),
        ENCRYPTION_SECRET: Joi.string().required(),
        SALT_OR_ROUND: Joi.number().required(),
      }),
      cache: true,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
