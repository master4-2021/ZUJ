import { Controller, Get, Query } from '@nestjs/common';
import { FixtureService } from './fixture.service';
import { Role, Roles } from '../../../common/decorators/roles';
import { Filter } from '../../../common/decorators/filter';
import { ParsedFilterQuery } from '../../filter/filter.types';
import { FixtureEntity } from './fixture.entity';
import {
  CalendarQuery,
  FixtureCarendarPayload,
  FixturePayload,
} from './fixture.types';

@Controller('fixture')
export class FixtureController {
  constructor(private readonly fixtureService: FixtureService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async getFixtures(
    @Filter() filter: ParsedFilterQuery<FixtureEntity>,
  ): Promise<FixturePayload[]> {
    return await this.fixtureService.getFixtures(filter);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('calendar')
  async getFixtureCalendar(
    @Query() query: CalendarQuery,
  ): Promise<FixtureCarendarPayload> {
    return await this.fixtureService.getFixtureCalendar(query);
  }
}
