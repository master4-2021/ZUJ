import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';

@Injectable()
export class ClubService extends BaseService<ClubEntity> {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
  ) {
    super(clubRepository);
  }
}
