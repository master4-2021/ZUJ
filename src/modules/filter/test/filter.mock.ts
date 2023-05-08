import {
  And,
  Equal,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { FilterRequestQuery, ParsedFilterQuery } from '../filter.types';
import { DateTime } from 'luxon';

const date1 = DateTime.now().toISO();
const date2 = DateTime.now().toISO();

const mockFilterQuery: FilterRequestQuery = {
  filter: {
    field1: 'value1',
    field2: {
      in: ['value1', 'value2'],
      nin: ['value3', 'value4'],
      gt: 'value5',
      lt: 'value6',
      gte: date1,
      lte: date2,
      like: 'value7',
      ne: 'value8',
    },
    or: [
      {
        field3: 'value1',
      },
      {
        'field4.subField4': {
          in: ['value2', 'value3'],
        },
      },
    ],
  },
  limit: '10',
  skip: '0',
  sort: {
    field1: 'asc',
  },
  fields: {
    field1: 1,
    field2: 0,
  },
};

const mockParsedFilterQuery: ParsedFilterQuery<Record<string, any>> = {
  where: [
    {
      field1: 'value1',
      field2: And(
        In(['value1', 'value2']),
        Not(In(['value3', 'value4'])),
        MoreThan('value5'),
        LessThan('value6'),
        MoreThanOrEqual(DateTime.fromISO(date1).toJSDate()),
        LessThanOrEqual(DateTime.fromISO(date2).toJSDate()),
        Like('%value7%'),
        Not(Equal('value8')),
      ),
      field3: 'value1',
    },
    {
      field1: 'value1',
      field2: And(
        In(['value1', 'value2']),
        Not(In(['value3', 'value4'])),
        MoreThan('value5'),
        LessThan('value6'),
        MoreThanOrEqual(DateTime.fromISO(date1).toJSDate()),
        LessThanOrEqual(DateTime.fromISO(date2).toJSDate()),
        Like('%value7%'),
        Not(Equal('value8')),
      ),
      field4: { subField4: And(In(['value2', 'value3'])) },
    },
  ],
  take: 10,
  skip: 0,
  order: {
    field1: 'ASC',
  },
  select: {
    field1: true,
    field2: false,
  },
};

export { mockFilterQuery, mockParsedFilterQuery, date1, date2 };
