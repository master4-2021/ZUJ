import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FilterService } from '../../modules/filter/filter.service';
import { PARSED_FILTER } from '../constants';
import {
  FilterRequestQuery,
  FilterType,
} from '../../modules/filter/filter.types';

@Injectable()
export class FilterQueryMiddleware implements NestMiddleware {
  constructor(private readonly filterService: FilterService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    if (
      req.method === 'GET' &&
      (req.query as FilterRequestQuery)?.type === FilterType.FILTER
    ) {
      req[PARSED_FILTER] = this.filterService.parseFilterRequestQuery(
        req.query,
      );
    }
    next();
  }
}
