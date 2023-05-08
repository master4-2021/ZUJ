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
  Filter,
  FilterOperators,
  FilterOperatorEnum,
  FilterRequestQuery,
  FilterValue,
  ParsedFilterQuery,
  Sort,
  Projections,
} from './filter.types';
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
    [FilterOperatorEnum.LIKE]: (value: FilterValue) => Like(`%${value}%`),
  };

  constructor(private readonly logger: LoggerService) {}

  parseFilterRequestQuery<T>(query: FilterRequestQuery): ParsedFilterQuery<T> {
    try {
      const parsedFilterQuery: ParsedFilterQuery<T> = {};
      if (query.filter) {
        parsedFilterQuery.where = this.parseFilter(query.filter);
      }
      if (query.fields) {
        parsedFilterQuery.select = this.parseSelectFromQueryString<T>(
          query.fields,
        );
      }
      if (query.sort) {
        parsedFilterQuery.order = this.parseSortFromQueryString<T>(query.sort);
      }
      if (!isNaN(+query.limit)) {
        parsedFilterQuery.take = +query.limit;
      }
      if (!isNaN(+query.skip)) {
        parsedFilterQuery.skip = +query.skip;
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
      parsedOperators.push(
        FilterService.parseOperatorsObject[key](getDateOrValue(value)),
      );
    });

    return And(...parsedOperators);
  }

  private parseBaseFilter<T>(filter: Filter): FindOptionsWhere<T> {
    const parsedBaseFilter: {
      [P in keyof T]?: FindOperator<FilterValue> | FilterValue;
    } = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        Object.assign(
          parsedBaseFilter,
          this.parseKeyValue(
            key,
            this.convertOperators(filter[key] as FilterOperators),
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

  private parseFilter<T>(filter: Filter): FindOptionsWhere<T>[] {
    const orFilter = [];
    const parsedFilter = {};
    for (const key in filter) {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        if (key === 'or' && Array.isArray(filter[key])) {
          (filter[key] as Filter[]).map((item: Filter) => {
            const parsedBaseFilter = this.parseBaseFilter(item);
            orFilter.push(parsedBaseFilter);
          });
        } else {
          Object.assign(
            parsedFilter,
            this.parseKeyValue(
              key,
              this.convertOperators(filter[key] as FilterOperators),
              false,
            ),
          );
        }
      } else {
        Object.assign(
          parsedFilter,
          this.parseKeyValue(key, filter[key] as FilterValue),
        );
      }
    }
    if (orFilter.length > 0) {
      return orFilter.map((item) => {
        return { ...item, ...parsedFilter };
      });
    }
    return [parsedFilter];
  }

  private parseSelectFromQueryString<T>(
    projections: Projections,
  ): FindOptionsSelect<T> {
    return Object.keys(projections).reduce((acc, key) => {
      if (projections[key] === 1) {
        Object.assign(acc, createObject(key, true));
      } else {
        Object.assign(acc, createObject(key, false));
      }
      return acc;
    }, {});
  }

  private parseSortFromQueryString<T>(sort: Sort): FindOptionsOrder<T> {
    return Object.keys(sort).reduce((acc, key) => {
      Object.assign(
        acc,
        createObject(key, (sort[key] as string).toUpperCase()),
      );
      return acc;
    }, {});
  }
}
