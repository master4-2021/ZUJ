import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.postgres.host'),
        port: configService.get<number>('database.postgres.port'),
        username: configService.get<string>('database.postgres.username'),
        password: configService.get<string>('database.postgres.password'),
        database: configService.get<string>('database.postgres.database'),
        entities: [],
        synchronize:
          configService.get<string>('database.postgres.synchronize') === 'true',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
