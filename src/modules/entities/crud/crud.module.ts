import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilterModule } from '../../filter/filter.module';
import { CrudController } from './crud.controller';
import { CrudEntity } from './crud.entity';
import { CrudService } from './crud.service';

@Module({
  imports: [FilterModule, TypeOrmModule.forFeature([CrudEntity])],
  controllers: [CrudController],
  providers: [CrudService],
  exports: [CrudService],
})
export class CrudModule {}
