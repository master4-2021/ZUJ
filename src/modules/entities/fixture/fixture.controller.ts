import { Controller, Get, Query } from '@nestjs/common';
import { FixtureService } from './fixture.service';
import { Role, Roles } from '../../../common/decorators/roles';
import { Filter } from '../../../common/decorators/filter';
import { ParsedFilterQuery } from '../../filter/types';
import { FixtureEntity } from './fixture.entity';
import { CalendarQuery } from './types';

@Controller('fixture')
export class FixtureController {
  constructor(private readonly fixtureService: FixtureService) {}

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async getFixtures(
    @Filter() filter: ParsedFilterQuery<FixtureEntity>,
  ): Promise<FixtureEntity[]> {
    return this.fixtureService.getFixtures(filter);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('calendar')
  async getFixturesCalendar(@Query() query: CalendarQuery): Promise<Date[]> {
    return this.fixtureService.getFixturesCalendar(query);
  }
}
