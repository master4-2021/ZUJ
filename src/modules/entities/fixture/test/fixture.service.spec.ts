import { Test, TestingModule } from '@nestjs/testing';
import { FixtureService } from '../fixture.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FixtureEntity } from '../fixture.entity';
import { mockRepository } from '../../../database/test/database.service.mock';
import { ParsedFilterQuery } from '../../../filter/filter.types';
import {
  CalendarQuery,
  FixtureCarendarPayload,
  FixturePayload,
} from '../fixture.types';
import {
  mockFixtureFilter,
  mockFixtureCalendarQuery,
  mockFixturePayload,
  mockFixtureCalendarPayload,
  mockFixturesWithKickoffTime,
} from './fixture.mock';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { DateTime } from 'luxon';
import { BusinessException } from '../../../../common/exceptions';
import { ErrorMessageEnum } from '../../../../common/types';
import { HttpStatus } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('FixtureService', () => {
  let fixtureService: FixtureService;

  let filter: ParsedFilterQuery<FixtureEntity>;
  let calendarQuery: CalendarQuery;
  let fixturePayloads: FixturePayload[];
  let fixtureCalendarPayload: FixtureCarendarPayload;
  let fixturesWithKickoffTime: Partial<FixtureEntity>[];

  beforeEach(async () => {
    filter = { ...mockFixtureFilter };
    calendarQuery = { ...mockFixtureCalendarQuery };
    fixturePayloads = [...mockFixturePayload];
    fixtureCalendarPayload = [...mockFixtureCalendarPayload];
    fixturesWithKickoffTime = [...mockFixturesWithKickoffTime];

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FixtureService,
        {
          provide: getRepositoryToken(FixtureEntity),
          useValue: mockRepository,
        },
      ],
    })
      .useMocker((target) => {
        if (typeof target === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            target,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    fixtureService = app.get<FixtureService>(FixtureService);
  });

  it('should be defined', () => {
    expect(fixtureService).toBeDefined();
  });

  describe('getFixtures', () => {
    it('should return the fixture payloads', async () => {
      jest.spyOn(fixtureService, 'find').mockResolvedValue(fixturePayloads);

      expect(await fixtureService.getFixtures(filter)).toStrictEqual(
        fixturePayloads,
      );

      expect(fixtureService.find).toHaveBeenCalledWith(filter);
    });

    it('if no kickoffTime filter provided, the filter should has kickoffTime filter by this week', async () => {
      jest.spyOn(fixtureService, 'find').mockResolvedValue(fixturePayloads);

      await fixtureService.getFixtures({});

      expect(fixtureService.find).toBeCalledWith({
        where: [
          {
            kickoffTime: And(
              MoreThanOrEqual(DateTime.now().startOf('week').toJSDate()),
              LessThanOrEqual(DateTime.now().endOf('week').toJSDate()),
            ),
          },
        ],
        relations: { tournament: true, home: true, away: true },
        order: { kickoffTime: 'ASC' },
      });
    });
  });

  describe('getFixtureCalendar', () => {
    it('should return the fixture calendar payload', async () => {
      jest
        .spyOn(fixtureService, 'find')
        .mockResolvedValue(fixturesWithKickoffTime as FixtureEntity[]);

      expect(
        await fixtureService.getFixtureCalendar(calendarQuery),
      ).toStrictEqual(fixtureCalendarPayload);

      expect(fixtureService.find).toHaveBeenCalledWith({
        where: [
          {
            kickoffTime: And(
              MoreThanOrEqual(DateTime.fromISO(calendarQuery.from).toJSDate()),
              LessThanOrEqual(DateTime.fromISO(calendarQuery.to).toJSDate()),
            ),
          },
        ],
        order: {
          kickoffTime: 'ASC',
        },
      });
    });

    it('if no calendar query provided, the filter should be in this month', async () => {
      jest.spyOn(fixtureService, 'find').mockResolvedValue([]);

      await fixtureService.getFixtureCalendar(null);

      expect(fixtureService.find).toHaveBeenCalledWith({
        where: [
          {
            kickoffTime: And(
              MoreThanOrEqual(DateTime.now().startOf('month').toJSDate()),
              LessThanOrEqual(DateTime.now().endOf('month').toJSDate()),
            ),
          },
        ],
        order: {
          kickoffTime: 'ASC',
        },
      });
    });

    it('should throw error when calendar query has invalid Date type', async () => {
      const error = new BusinessException(
        ErrorMessageEnum.invalidFilter,
        HttpStatus.BAD_REQUEST,
      );

      jest.spyOn(fixtureService, 'find').mockResolvedValue(null);

      await expect(
        fixtureService.getFixtureCalendar({
          from: 'invalidDate',
          to: 'invalidDate',
        }),
      ).rejects.toThrow(error);

      expect(fixtureService.find).not.toHaveBeenCalled();
    });

    it('should throw error when calendar query has "from" field greater than "to"', async () => {
      const error = new BusinessException(
        ErrorMessageEnum.startDateGreaterThanEndDate,
        HttpStatus.BAD_REQUEST,
      );

      jest.spyOn(fixtureService, 'find').mockResolvedValue(null);

      await expect(
        fixtureService.getFixtureCalendar({
          from: '2023-04-30',
          to: '2023-04-01',
        }),
      ).rejects.toThrow(error);

      expect(fixtureService.find).not.toHaveBeenCalled();
    });
  });
});
