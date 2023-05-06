import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessException } from '../../../common/exceptions';
import { BaseService } from '../../base/base.service';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { ChangePasswordDto, UpdateUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { ParsedFilterQuery } from '../../filter/types';
import hideOrOmitDeep from '../../../utils/hideOrOmitFields';
import { UserPayload } from './user.types';
import { ErrorMessageEnum } from '../../../common/types';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {
    super(userRepository);
  }

  async findUsers(
    filter: ParsedFilterQuery<UserEntity>,
  ): Promise<UserPayload[]> {
    const users = await this.find(filter);
    return hideOrOmitDeep(users, ['password'], true) as UserPayload[];
  }

  async findUserById(id: string): Promise<UserPayload> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }
    return hideOrOmitDeep(user, ['password'], true) as UserPayload;
  }

  async updateUserById(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<UserPayload> {
    const updated = await this.updateById(id, updateDto);
    return hideOrOmitDeep(updated, ['password'], true) as UserPayload;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserPayload> {
    const user = await this.findById(userId);

    if (!user) {
      throw new BusinessException(
        ErrorMessageEnum.userNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { oldPassword, newPassword } = changePasswordDto;

    if (oldPassword === newPassword) {
      throw new BusinessException(
        ErrorMessageEnum.oldPasswordEqualNewPassword,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isOldPasswordValid = await this.encryptionAndHashService.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new BusinessException(
        ErrorMessageEnum.invalidOldPassword,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPasswordHash = await this.encryptionAndHashService.hash(
      newPassword,
    );

    const updated = await this.updateById(user.id, {
      password: newPasswordHash,
    });

    return hideOrOmitDeep(updated, ['password'], true) as UserPayload;
  }
}
