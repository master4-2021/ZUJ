import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AuthorizedUser } from '../../../common/decorators/authorizedUser';
import { Role, Roles } from '../../../common/decorators/roles';
import { ValidatedUser } from '../../auth/auth.types';
import { ParsedFilterQuery } from '../../filter/types';
import { ChangePasswordDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { Filter } from '../../../common/decorators/filter';
import { UserPayload } from './user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserPayload> {
    return await this.userService.findUserById(id);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findUsers(
    @Filter() filter: ParsedFilterQuery<UserEntity>,
  ): Promise<UserPayload[]> {
    return await this.userService.findUsers(filter);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get('me')
  async getProfile(
    @AuthorizedUser() user: ValidatedUser,
  ): Promise<UserPayload> {
    return await this.userService.findUserById(user.userId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put('me/profile')
  async updateById(
    @AuthorizedUser() user: ValidatedUser,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserPayload> {
    return await this.userService.updateUserById(user.userId, updateDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put('me/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
  ): Promise<UserPayload> {
    return await this.userService.changePassword(id, body);
  }
}
