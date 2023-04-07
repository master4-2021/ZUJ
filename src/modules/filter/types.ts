// api GET /?filter={"field1":"value1","field2":{"in":["value1","value2"], "nin":["value4"], "ne":"value5","gt/gte/lt/lte":"value6"},"or/nor":[{"field1":"value1","field2":"value2"}]
//           &limit=10&skip=0&sort={"field1":"ASC","field2":"DESC"}&fields={"field1":1,"field2":0}

import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export type FilterValue = string | number | boolean | Date | RegExp;

export enum FilterOperatorEnum {
  in = 'in',
  nin = 'nin',
  ne = 'ne',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
}

export type Sort<T> = {
  [P in keyof T]?: 'ASC' | 'DESC';
};

export type FilterOperator = {
  [key in FilterOperatorEnum]?: FilterValue | FilterValue[];
};

export type BaseFilter<T> = {
  [P in keyof T]?: FilterValue | FilterOperator;
};

export type Filter<T> = BaseFilter<T> & {
  or?: BaseFilter<T>[];
};

export type FilterRequestQuery = {
  filter?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  projections?: string;
};

export type ParsedFilterQuery<T> = {
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  take?: number;
  skip?: number;
  order?: FindOptionsOrder<T>;
  select?: FindOptionsSelect<T>;
  relations?: FindOptionsRelations<T>;
};
