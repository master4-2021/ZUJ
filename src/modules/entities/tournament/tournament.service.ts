import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { LoggerService } from '../../logger/logger.service';
import { TournamentEntity } from './tournament.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TournamentService extends BaseService<
  LoggerService,
  TournamentEntity
> {
  constructor(
    @InjectRepository(TournamentEntity)
    private readonly tournamentRepository: Repository<TournamentEntity>,
    logger: LoggerService,
  ) {
    super(tournamentRepository, logger);
  }
}
