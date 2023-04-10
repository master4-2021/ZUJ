import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AuthorizedUser } from '../../../common/decorators/authorizedUser';
import { Role, Roles } from '../../../common/decorators/roles';
import { ValidatedUser } from '../../auth/types';
import { ParsedFilterQuery } from '../../filter/types';
import { ChangePasswordDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { Filter } from '../../../common/decorators/filter';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findUsers(
    @Filter() filter: ParsedFilterQuery<UserEntity>,
  ): Promise<UserEntity[]> {
    return this.userService.find(filter);
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
