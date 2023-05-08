import { Test, TestingModule } from '@nestjs/testing';
import { FixtureService } from '../fixture.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { FixtureEntity } from '../fixture.entity';
import { FixtureController } from '../fixture.controller';
import { ParsedFilterQuery } from '../../../filter/filter.types';
import {
  CalendarQuery,
  FixtureCarendarPayload,
  FixturePayload,
} from '../fixture.types';
import {
  mockFixtureCalendarPayload,
  mockFixtureCalendarQuery,
  mockFixtureFilter,
  mockFixturePayload,
} from './fixture.mock';

const moduleMocker = new ModuleMocker(global);

describe('FixtureController', () => {
  let fixtureService: FixtureService;
  let fixtureController: FixtureController;

  let filter: ParsedFilterQuery<FixtureEntity>;
  let calendarQuery: CalendarQuery;
  let fixturePayloads: FixturePayload[];
  let fixtureCalendarPayload: FixtureCarendarPayload;

  beforeEach(async () => {
    filter = { ...mockFixtureFilter };
    calendarQuery = { ...mockFixtureCalendarQuery };
    fixturePayloads = [...mockFixturePayload];
    fixtureCalendarPayload = [...mockFixtureCalendarPayload];

    const app: TestingModule = await Test.createTestingModule({
      controllers: [FixtureController],
    })
      .useMocker((target) => {
        if (target === FixtureService) {
          return {
            getFixtures: jest.fn().mockResolvedValue(fixturePayloads),
            getFixtureCalendar: jest
              .fn()
              .mockResolvedValue(fixtureCalendarPayload),
          };
        }

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
    fixtureController = app.get<FixtureController>(FixtureController);
  });

  it('should be defined', () => {
    expect(fixtureController).toBeDefined();
  });

  describe('getFixtures', () => {
    it('should return fixtures', async () => {
      expect(await fixtureController.getFixtures(filter)).toStrictEqual(
        fixturePayloads,
      );

      expect(fixtureService.getFixtures).toHaveBeenCalledWith(filter);
    });

    it('should return fixtures calendar', async () => {
      expect(
        await fixtureController.getFixtureCalendar(calendarQuery),
      ).toStrictEqual(fixtureCalendarPayload);

      expect(fixtureService.getFixtureCalendar).toHaveBeenCalledWith(
        calendarQuery,
      );
    });
  });
});
