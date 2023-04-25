import { HttpStatus, Injectable } from '@nestjs/common';
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
import { BusinessException } from '../../common/exceptions';
import { LoggerService } from '../logger/logger.service';
import {
  BaseFilter,
  Filter,
  FilterOperators,
  FilterOperatorEnum,
  FilterRequestQuery,
  FilterValue,
  ParsedFilterQuery,
  Sort,
} from './types';
import createObject from '../../utils/createObject';
import getDateOrValue from '../../utils/getDateOrValue';
import { ErrorMessageEnum } from '../../common/types';

@Injectable()
export class FilterService {
  static parseOperatorsObject = {
    [FilterOperatorEnum.IN]: (value: FilterValue[]) => In(value),
    [FilterOperatorEnum.NIN]: (value: FilterValue[]) => Not(In(value)),
    [FilterOperatorEnum.NE]: (value: FilterValue) => Not(Equal(value)),
    [FilterOperatorEnum.GT]: (value: FilterValue) => MoreThan(value),
    [FilterOperatorEnum.GTE]: (value: FilterValue) => MoreThanOrEqual(value),
    [FilterOperatorEnum.LT]: (value: FilterValue) => LessThan(value),
    [FilterOperatorEnum.LTE]: (value: FilterValue) => LessThanOrEqual(value),
    [FilterOperatorEnum.LIKE]: (value: FilterValue) => Like(value),
  };

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
      throw new BusinessException(
        ErrorMessageEnum.invalidFilter,
        HttpStatus.BAD_REQUEST,
      );
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

  private convertOperators(
    operators: FilterOperators,
  ): FindOperator<FilterValue> {
    const operatorKeys = Object.keys(operators);
    const parsedOperators: FindOperator<FilterValue>[] = [];
    operatorKeys.forEach((key) => {
      const value = operators[key];
      parsedOperators.push(FilterService.parseOperatorsObject[key](value));
    });

    return And(...parsedOperators);
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
            And(this.convertOperators(filter[key] as FilterOperators)),
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

  private parseFilter<T>(filter: Filter<T>): FindOptionsWhere<T>[] {
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
              And(this.convertOperators(filter[key])),
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
    return [parsedFilter];
  }

  private parseFilterFromQueryString<T>(filter: string): Filter<T> {
    return JSON.parse(filter) as Filter<T>;
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
