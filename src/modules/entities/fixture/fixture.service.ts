import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FixtureEntity } from './fixture.entity';
import { BusinessException } from '../../../common/exceptions';
import {
  BAD_REQUEST,
  ErrorMessageEnum,
} from '../../../common/constants/errors';

import { DateTime } from 'luxon';
import { CalendarQuery } from './types';
import { ParsedFilterQuery } from '../../filter/types';

@Injectable()
export class FixtureService extends BaseService<FixtureEntity> {
  constructor(
    @InjectRepository(FixtureEntity)
    private readonly fixtureRepository: Repository<FixtureEntity>,
  ) {
    super(fixtureRepository);
  }

  async getFixtures(
    filter: ParsedFilterQuery<FixtureEntity>,
  ): Promise<FixtureEntity[]> {
    filter.relations = { tournament: true, home: true, away: true };
    filter.order = { kickoffTime: 'ASC' };

    return this.fixtureRepository.find(filter);
  }

  async getFixturesCalendar(query: CalendarQuery): Promise<Date[]> {
    const gte = query?.from
      ? DateTime.fromISO(query.from)
      : DateTime.now().startOf('month');
    const lte = query?.to
      ? DateTime.fromISO(query.to)
      : DateTime.now().endOf('month');
    if (!gte.isValid || !lte.isValid) {
      throw new BusinessException(BAD_REQUEST, ErrorMessageEnum.invalidFilter);
    }
    if (gte > lte) {
      throw new BusinessException(
        BAD_REQUEST,
        ErrorMessageEnum.startDateGreaterThanEndDate,
      );
    }
    const fixtures = await this.fixtureRepository.find({
      where: {
        kickoffTime: And(
          MoreThanOrEqual(gte.toJSDate()),
          LessThanOrEqual(lte.toJSDate()),
        ),
      },
      order: {
        kickoffTime: 'ASC',
      },
    });
    const dates = fixtures.map((fixture) => fixture.kickoffTime);
    return dates;
  }
}
