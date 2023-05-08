import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FixtureEntity } from './fixture.entity';
import { BusinessException } from '../../../common/exceptions';

import { DateTime } from 'luxon';
import {
  CalendarQuery,
  FixtureCarendarPayload,
  FixturePayload,
} from './fixture.types';
import { ParsedFilterQuery } from '../../filter/filter.types';
import { ErrorMessageEnum } from '../../../common/types';
import { Filter } from '../../../common/decorators/filter';

@Injectable()
export class FixtureService extends BaseService<FixtureEntity> {
  constructor(
    @InjectRepository(FixtureEntity)
    private readonly fixtureRepository: Repository<FixtureEntity>,
  ) {
    super(fixtureRepository);
  }

  async getFixtures(
    @Filter() filter: ParsedFilterQuery<FixtureEntity>,
  ): Promise<FixturePayload[]> {
    const where = filter.where || [];
    if (!where.length) {
      where.push({
        kickoffTime: And(
          MoreThanOrEqual(DateTime.now().startOf('week').toJSDate()),
          LessThanOrEqual(DateTime.now().endOf('week').toJSDate()),
        ),
      });
    } else {
      where.forEach((w) => {
        if (!w.kickoffTime) {
          w.kickoffTime = And(
            MoreThanOrEqual(DateTime.now().startOf('week').toJSDate()),
            LessThanOrEqual(DateTime.now().endOf('week').toJSDate()),
          );
        }
      });
    }

    filter.where = where;
    filter.relations = { tournament: true, home: true, away: true };
    filter.order = { kickoffTime: 'ASC' };

    return this.find(filter);
  }

  async getFixtureCalendar(
    query: CalendarQuery,
  ): Promise<FixtureCarendarPayload> {
    const gte = query?.from
      ? DateTime.fromISO(query.from)
      : DateTime.now().startOf('month');
    const lte = query?.to
      ? DateTime.fromISO(query.to)
      : DateTime.now().endOf('month');
    if (!gte.isValid || !lte.isValid) {
      throw new BusinessException(
        ErrorMessageEnum.invalidFilter,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (gte > lte) {
      throw new BusinessException(
        ErrorMessageEnum.startDateGreaterThanEndDate,
        HttpStatus.BAD_REQUEST,
      );
    }
    const fixtures = await this.find({
      where: [
        {
          kickoffTime: And(
            MoreThanOrEqual(gte.toJSDate()),
            LessThanOrEqual(lte.toJSDate()),
          ),
        },
      ],
      order: {
        kickoffTime: 'ASC',
      },
    });
    return fixtures.map((fixture) =>
      DateTime.fromJSDate(fixture.kickoffTime).toISO(),
    );
  }
}
