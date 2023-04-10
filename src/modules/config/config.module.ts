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
        MYSQL_URL: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_SYCRONIZE: Joi.string().required(),
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
