import { Test, TestingModule } from '@nestjs/testing';
import { FilterService } from '../filter.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { FilterRequestQuery, ParsedFilterQuery } from '../filter.types';
import {
  date1,
  date2,
  mockFilterQuery,
  mockParsedFilterQuery,
} from './filter.mock';
import { DateTime } from 'luxon';

const moduleMocker = new ModuleMocker(global);

describe('FilterService', () => {
  let filterService: FilterService;

  let filterQuery: FilterRequestQuery;
  let parsedFilterQuery: ParsedFilterQuery<Record<string, any>>;

  beforeEach(async () => {
    filterQuery = { ...mockFilterQuery };
    parsedFilterQuery = { ...mockParsedFilterQuery };
    jest.mock(
      '../../../utils/getDateOrValue',
      jest
        .fn()
        .mockReturnValueOnce(DateTime.fromISO(date1).toJSDate())
        .mockReturnValueOnce(DateTime.fromISO(date2).toJSDate()),
    );

    const app: TestingModule = await Test.createTestingModule({
      providers: [FilterService],
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

    filterService = app.get<FilterService>(FilterService);
  });

  it('should be defined', () => {
    expect(filterService).toBeDefined();
  });

  describe('parseFilterRequestQuery', () => {
    it('should parse filter correctly', () => {
      expect(filterService.parseFilterRequestQuery(filterQuery)).toStrictEqual(
        parsedFilterQuery,
      );
    });
  });
});
