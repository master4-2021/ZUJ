import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { AuthorizedUser } from '../../../common/decorators/authorizedUser';
import { Role, Roles } from '../../../common/decorators/role';
import { ValidatedUser } from '../../auth/types';
import { FilterService } from '../../filter/filter.service';
import { FilterRequestQuery } from '../../filter/types';
import { ChangePasswordDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly filterService: FilterService,
  ) {}

  @Roles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findUsers(@Query() query: FilterRequestQuery): Promise<UserEntity[]> {
    const parsedFilterQuery = this.filterService.parseFilterRequestQuery(query);
    return this.userService.find(parsedFilterQuery);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get('me')
  async getProfile(@AuthorizedUser() user: ValidatedUser): Promise<UserEntity> {
    return this.userService.findById(user.userId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put('me/profile')
  async updateById(
    @AuthorizedUser() user: ValidatedUser,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateById(user.userId, updateDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put('me/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
  ): Promise<UserEntity> {
    return this.userService.changePassword(id, body);
  }
}
