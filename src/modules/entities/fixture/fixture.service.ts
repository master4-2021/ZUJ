import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { LoggerService } from '../../logger/logger.service';
import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FixtureEntity } from './fixture.entity';
import { BusinessException } from '../../../common/exceptions';
import {
  ErrorMessageEnum,
  INVALID_FILTER_QUERY,
} from '../../../common/constants/errors';

import { DateTime } from 'luxon';
import { CalendarQuery } from './types';

@Injectable()
export class FixtureService extends BaseService<LoggerService, FixtureEntity> {
  constructor(
    @InjectRepository(FixtureEntity)
    private readonly fixtureRepository: Repository<FixtureEntity>,
    logger: LoggerService,
  ) {
    super(fixtureRepository, logger);
  }

  async getFixturesCalendar(query: CalendarQuery): Promise<Date[]> {
    const gte = query?.from
      ? DateTime.fromISO(query.from)
      : DateTime.now().startOf('month');
    const lte = query?.to
      ? DateTime.fromISO(query.to)
      : DateTime.now().endOf('month');
    if (!gte.isValid || !lte.isValid) {
      throw new BusinessException(
        INVALID_FILTER_QUERY,
        ErrorMessageEnum.invalidFilter,
      );
    }
    if (gte > lte) {
      throw new BusinessException(
        INVALID_FILTER_QUERY,
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
