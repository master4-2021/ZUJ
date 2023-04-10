import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixtureEntity } from './fixture.entity';
import { FixtureController } from './fixture.controller';
import { FixtureService } from './fixture.service';

@Module({
  imports: [TypeOrmModule.forFeature([FixtureEntity])],
  controllers: [FixtureController],
  providers: [FixtureService],
})
export class FixtureModule {}
