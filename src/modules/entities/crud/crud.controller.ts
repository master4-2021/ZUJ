import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import { AuthorizedUser } from '../../../common/decorators/authorizedUser';
import { Role, Roles } from '../../../common/decorators/role';
import { ValidatedUser } from '../../auth/types';
import { FilterService } from '../../filter/filter.service';
import { FilterRequestQuery } from '../../filter/types';
import { CrudDto } from './crud.dto';
import { CrudEntity } from './crud.entity';
import { CrudService } from './crud.service';

@Controller('crud')
export class CrudController {
  constructor(
    private readonly crudService: CrudService,
    private readonly filterService: FilterService,
  ) {}

  @Roles(Role.ADMIN)
  @Get('all')
  async findAll(@Query() query: FilterRequestQuery): Promise<CrudEntity[]> {
    const parsedFilterQuery = this.filterService.parseFilterRequestQuery(query);
    return await this.crudService.find(parsedFilterQuery);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async findByUserId(
    @AuthorizedUser() user: ValidatedUser,
    @Query() query: FilterRequestQuery,
  ): Promise<CrudEntity[]> {
    const parsedFilterQuery = this.filterService.parseFilterRequestQuery(query);
    if (!(parsedFilterQuery.where as FindOptionsWhere<CrudEntity>[])?.length) {
      parsedFilterQuery.where = {
        ...parsedFilterQuery.where,
        userId: user.userId,
      };
    } else {
      (parsedFilterQuery.where as FindOptionsWhere<CrudEntity>[]).forEach(
        (item) => {
          item.userId = user.userId;
        },
      );
    }
    return await this.crudService.find(parsedFilterQuery);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<CrudEntity> {
    return await this.crudService.findById(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(
    @AuthorizedUser() user: ValidatedUser,
    @Body() createDto: CrudDto,
  ): Promise<CrudEntity> {
    return await this.crudService.save({ ...createDto, userId: user.userId });
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateDto: CrudDto,
  ): Promise<CrudEntity> {
    return await this.crudService.updateById(id, updateDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.crudService.deleteById(id);
  }
}
