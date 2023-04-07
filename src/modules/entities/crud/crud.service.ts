import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { LoggerService } from '../../logger/logger.service';
import { CrudEntity } from './crud.entity';

@Injectable()
export class CrudService extends BaseService<LoggerService, CrudEntity> {
  constructor(
    @InjectRepository(CrudEntity)
    private readonly crudRepository: Repository<CrudEntity>,
    logger: LoggerService,
  ) {
    super(crudRepository, logger);
  }
}
