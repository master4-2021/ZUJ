import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { TournamentEntity } from './tournament.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TournamentService extends BaseService<TournamentEntity> {
  constructor(
    @InjectRepository(TournamentEntity)
    private readonly tournamentRepository: Repository<TournamentEntity>,
  ) {
    super(tournamentRepository);
  }
}
