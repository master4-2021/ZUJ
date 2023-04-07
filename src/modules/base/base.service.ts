import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { ParsedFilterQuery } from '../filter/types';
import { LoggerService } from '../logger/logger.service';
import { BaseEntity } from './base.entity';

@Injectable()
export abstract class BaseService<
  L extends LoggerService,
  T extends BaseEntity,
> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly logger: L,
  ) {}

  async count(filterQuery: ParsedFilterQuery<T> = {}): Promise<number> {
    return await this.repository.count({
      where: filterQuery.where,
    });
  }

  async findAll(filterQuery: ParsedFilterQuery<T> = {}): Promise<T[]> {
    return await this.repository.find({
      select: this.getSelectQuery(filterQuery.select),
      relations: filterQuery.relations,
    });
  }

  async find(filterQuery: ParsedFilterQuery<T> = {}): Promise<T[]> {
    return await this.repository.find({
      where: filterQuery.where,
      select: this.getSelectQuery(filterQuery.select),
      skip: filterQuery.skip,
      take: filterQuery.take,
      order: filterQuery.order,
      relations: filterQuery.relations,
    });
  }

  async findById(
    id: string,
    filterQuery: ParsedFilterQuery<T> = {},
  ): Promise<T> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      select: this.getSelectQuery(filterQuery.select),
      relations: filterQuery.relations,
    });
  }

  async findByIds(
    ids: string[],
    filterQuery: ParsedFilterQuery<T> = {},
  ): Promise<T[]> {
    return await this.repository.find({
      where: { id: In(ids) } as FindOptionsWhere<T>,
      select: this.getSelectQuery(filterQuery.select),
      relations: filterQuery.relations,
    });
  }

  async findOne(filterQuery: ParsedFilterQuery<T> = {}): Promise<T> {
    return await this.repository.findOne({
      where: filterQuery.where,
      select: this.getSelectQuery(filterQuery.select),
      order: filterQuery.order,
      relations: filterQuery.relations,
    });
  }

  async save(entity: Partial<T>): Promise<T> {
    return await this.repository.save(entity as T);
  }

  async saveMany(entities: Partial<T>[]): Promise<T[]> {
    return await this.repository.save(entities as T[]);
  }

  async updateOne(
    filterQuery: ParsedFilterQuery<T>,
    updateDto: Partial<T>,
  ): Promise<T> {
    const entity = await this.findOne(filterQuery);
    if (!entity) {
      return undefined;
    }
    return await this.save({
      ...entity,
      ...updateDto,
    });
  }

  async updateById(id: string, updateDto: Partial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      return undefined;
    }
    return await this.save({
      ...entity,
      ...updateDto,
    });
  }

  async updateMany(
    filterQuery: ParsedFilterQuery<T>,
    updateDto: Partial<T>,
  ): Promise<T[]> {
    const entities = await this.find(filterQuery);
    if (!entities?.length) {
      return [];
    }
    return await this.saveMany(
      entities.map((entity) => ({
        ...entity,
        ...updateDto,
      })),
    );
  }

  async deleteById(id: string): Promise<DeleteResult> {
    const entity = await this.findById(id);
    if (!entity) {
      return undefined;
    }
    return await this.repository.delete({
      id: entity.id,
    } as FindOptionsWhere<T>);
  }

  private getSelectQuery(
    select: FindOptionsSelect<T> = {},
  ): FindOptionsSelect<T> {
    if (!Object.keys(select)?.length) return select;
    return { ...select, id: true, createdAt: true, updatedAt: true };
  }
}
