import { Injectable } from '@nestjs/common';
import {
  And,
  Equal,
  FindOperator,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { BAD_REQUEST, ErrorMessageEnum } from '../../common/constants/errors';
import { BusinessException } from '../../common/exceptions';
import { LoggerService } from '../logger/logger.service';
import {
  BaseFilter,
  Filter,
  FilterOperator,
  FilterOperatorEnum,
  FilterRequestQuery,
  FilterValue,
  ParsedFilterQuery,
  Sort,
} from './types';
import createObject from '../../utils/createObject';
import getDateOrValue from '../../utils/getDateOrValue';

@Injectable()
export class FilterService {
  constructor(private readonly logger: LoggerService) {}

  parseFilterRequestQuery<T>(query: FilterRequestQuery): ParsedFilterQuery<T> {
    try {
      const parsedFilterQuery: ParsedFilterQuery<T> = {};
      if (query.filter) {
        parsedFilterQuery.where = this.parseFilter(
          this.parseFilterFromQueryString<T>(query.filter),
        );
      }
      if (query.fields) {
        parsedFilterQuery.select = this.parseSelectFromQueryString<T>(
          query.fields,
        );
      }
      if (query.sort) {
        parsedFilterQuery.order = this.parseSortFromQueryString<T>(query.sort);
      }
      if (query.limit) {
        parsedFilterQuery.take = query.limit;
      }
      if (query.skip) {
        parsedFilterQuery.skip = query.skip;
      }
      return parsedFilterQuery;
    } catch (error) {
      this.logger.error_(
        'Failed to parse filter request query',
        error,
        FilterService.name,
      );
      throw new BusinessException(BAD_REQUEST, ErrorMessageEnum.invalidFilter);
    }
  }

  private parseKeyValue(
    key: string,
    value: FilterValue | FindOperator<FilterValue>,
    checkDateValue = true,
  ) {
    if (!checkDateValue) {
      return createObject(key, value);
    }
    return createObject(key, getDateOrValue(value));
  }

  private convertOperator(operator: FilterOperator): FindOperator<FilterValue> {
    const key = Object.keys(operator)[0] as FilterOperatorEnum;
    const value = operator[key];
    switch (key) {
      case FilterOperatorEnum.IN:
        return In(getDateOrValue(value) as FilterValue[]);
      case FilterOperatorEnum.NIN:
        return Not(In(getDateOrValue(value) as FilterValue[]));
      case FilterOperatorEnum.NE:
        return Not(Equal(getDateOrValue(value) as FilterValue));
      case FilterOperatorEnum.GT:
        return MoreThan(getDateOrValue(value) as FilterValue);
      case FilterOperatorEnum.GTE:
        return MoreThanOrEqual(getDateOrValue(value) as FilterValue);
      case FilterOperatorEnum.LT:
        return LessThan(getDateOrValue(value) as FilterValue);
      case FilterOperatorEnum.LTE:
        return LessThanOrEqual(getDateOrValue(value) as FilterValue);
      case FilterOperatorEnum.LIKE:
        // string only
        return Like(`%${value}%` as FilterValue);
      default:
        return Equal(getDateOrValue(value) as FilterValue);
    }
  }

  private parseBaseFilter<T>(filter: BaseFilter<T>): FindOptionsWhere<T> {
    const parsedBaseFilter: {
      [P in keyof T]?: FindOperator<FilterValue> | FilterValue;
    } = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        Object.assign(
          parsedBaseFilter,
          this.parseKeyValue(
            key,
            And(this.convertOperator(filter[key] as FilterOperator)),
            false,
          ),
        );
      } else {
        Object.assign(
          parsedBaseFilter,
          this.parseKeyValue(key, filter[key] as FilterValue),
        );
      }
    }
    return parsedBaseFilter as FindOptionsWhere<T>;
  }

  private parseFilterFromQueryString<T>(filter: string): Filter<T> {
    return JSON.parse(filter) as Filter<T>;
  }

  private parseFilter<T>(
    filter: Filter<T>,
  ): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
    const orFilter = [];
    const parsedFilter = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        if (key === 'or') {
          filter[key].map((item: BaseFilter<T>) => {
            const parsedBaseFilter = this.parseBaseFilter(item);
            orFilter.push(parsedBaseFilter);
          });
        } else {
          Object.assign(
            parsedFilter,
            this.parseKeyValue(
              key,
              And(this.convertOperator(filter[key])),
              false,
            ),
          );
        }
      } else {
        Object.assign(parsedFilter, this.parseKeyValue(key, filter[key]));
      }
    }
    if (orFilter.length > 0) {
      return orFilter.map((item) => {
        return { ...item, ...parsedFilter };
      });
    }
    return parsedFilter;
  }

  private parseSelectFromQueryString<T>(
    projections: string,
  ): FindOptionsSelect<T> {
    const parsed = JSON.parse(projections) as { [P in keyof T]?: number };
    return Object.keys(parsed).reduce((acc, key) => {
      if (parsed[key] === 1) {
        Object.assign(acc, createObject(key, true));
      } else {
        Object.assign(acc, createObject(key, false));
      }
      return acc;
    }, {});
  }

  private parseSortFromQueryString<T>(sort: string): FindOptionsOrder<T> {
    const parsed = JSON.parse(sort) as Sort<T>;
    return Object.keys(parsed).reduce((acc, key) => {
      Object.assign(
        acc,
        createObject(key, (parsed[key] as string).toUpperCase()),
      );
      return acc;
    }, {});
  }
}
