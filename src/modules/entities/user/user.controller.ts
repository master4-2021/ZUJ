import { Body, Controller, Get, Put } from '@nestjs/common';
import { AuthorizedUser } from '../../../common/decorators/authorizedUser';
import { Role, Roles } from '../../../common/decorators/roles';
import { ValidatedUser } from '../../auth/auth.types';
import { ChangePasswordDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { UserPayload } from './user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Roles(Role.USER, Role.ADMIN)
  @Get('me')
  async getProfile(
    @AuthorizedUser() user: ValidatedUser,
  ): Promise<UserPayload> {
    return await this.userService.findUserById(user.userId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put('me')
  async updateById(
    @AuthorizedUser() user: ValidatedUser,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserPayload> {
    return await this.userService.updateUserById(user.userId, updateDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Put('me/change-password')
  async changePassword(
    @AuthorizedUser() user: ValidatedUser,
    @Body() body: ChangePasswordDto,
  ): Promise<UserPayload> {
    return await this.userService.changePassword(user.userId, body);
  }
}
