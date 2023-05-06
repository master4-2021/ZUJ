import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export enum FilterType {
  FILTER = 'filter',
  OTHER = 'other',
}

export type FilterValue = string | number | boolean;

export enum FilterOperatorEnum {
  IN = 'in',
  NIN = 'nin',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  // string only
  LIKE = 'like',
}

export type Projections = {
  [key: string]: 0 | 1;
};

export type Sort = {
  [key: string]: 'ASC' | 'DESC' | 'asc' | 'desc';
};

export type FilterOperators = {
  [key in FilterOperatorEnum]?: FilterValue | FilterValue[];
};

export type Filter = {
  [key: string]: FilterValue | FilterOperators | Filter[];
};

export type FilterRequestQuery = {
  type?: FilterType;
  filter?: Filter;
  skip?: string;
  limit?: string;
  sort?: Sort;
  fields?: Projections;
};

export type ParsedFilterQuery<T> = {
  where?: FindOptionsWhere<T>[];
  take?: number;
  skip?: number;
  order?: FindOptionsOrder<T>;
  select?: FindOptionsSelect<T>;
  relations?: FindOptionsRelations<T>;
};
