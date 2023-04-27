import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.mysql.host'),
        port: configService.get<number>('database.mysql.port'),
        username: configService.get<string>('database.mysql.username'),
        password: configService.get<string>('database.mysql.password'),
        database: configService.get<string>('database.mysql.database'),
        entities: [],
        synchronize:
          configService.get<string>('database.mysql.synchronize') === 'true',
        dropSchema:
          configService.get<string>('database.mysql.dropSchema') === 'true',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
