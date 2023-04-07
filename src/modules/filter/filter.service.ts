import { Injectable } from '@nestjs/common';
import {
  Equal,
  FindOperator,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import {
  ErrorMessageEnum,
  INVALID_FILTER_QUERY,
} from '../../common/constants/errors';
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
} from './types';

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
      if (query.projections) {
        parsedFilterQuery.select = this.parseSelectFromQueryString<T>(
          query.projections,
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
      throw new BusinessException(
        INVALID_FILTER_QUERY,
        ErrorMessageEnum.invalidFilter,
      );
    }
  }

  private convertOperator(operator: FilterOperator): FindOperator<FilterValue> {
    const key = Object.keys(operator)[0] as FilterOperatorEnum;
    const value = operator[key];
    switch (key) {
      case FilterOperatorEnum.in:
        return In(value as FilterValue[]);
      case FilterOperatorEnum.nin:
        return Not(In(value as FilterValue[]));
      case FilterOperatorEnum.ne:
        return Not(Equal(value as FilterValue));
      case FilterOperatorEnum.gt:
        return MoreThan(value as FilterValue);
      case FilterOperatorEnum.gte:
        return MoreThanOrEqual(value as FilterValue);
      case FilterOperatorEnum.lt:
        return LessThan(value as FilterValue);
      case FilterOperatorEnum.lte:
        return LessThanOrEqual(value as FilterValue);
      default:
        return Equal(value as FilterValue);
    }
  }

  private parseBaseFilter<T>(filter: BaseFilter<T>): FindOptionsWhere<T> {
    const parsedBaseFilter: {
      [P in keyof T]?: FindOperator<FilterValue> | FilterValue;
    } = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        parsedBaseFilter[key] = this.convertOperator(
          filter[key] as FilterOperator,
        );
      } else {
        parsedBaseFilter[key] = filter[key] as FilterValue;
      }
    }
    return filter as FindOptionsWhere<T>;
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
          parsedFilter[key] = this.convertOperator(filter[key]);
        }
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
        acc[key] = true;
      } else {
        acc[key] = false;
      }
      return acc;
    }, {});
  }

  private parseSortFromQueryString<T>(sort: string): FindOptionsOrder<T> {
    return JSON.parse(sort);
  }
}
