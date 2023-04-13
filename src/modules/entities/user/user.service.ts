import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BAD_REQUEST,
  ErrorMessageEnum,
  UNAUTHORIZED,
} from '../../../common/constants/errors';
import { BusinessException } from '../../../common/exceptions';
import { BaseService } from '../../base/base.service';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { ChangePasswordDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {
    super(userRepository);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);

    if (!user) {
      throw new BusinessException(UNAUTHORIZED, ErrorMessageEnum.userNotFound);
    }

    const { oldPassword, newPassword } = changePasswordDto;

    if (oldPassword === newPassword) {
      throw new BusinessException(
        BAD_REQUEST,
        ErrorMessageEnum.oldPasswordEqualNewPassword,
      );
    }

    const isOldPasswordValid = await this.encryptionAndHashService.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new BusinessException(
        BAD_REQUEST,
        ErrorMessageEnum.invalidOldPassword,
      );
    }

    const newPasswordHash = await this.encryptionAndHashService.hash(
      newPassword,
    );

    return await this.updateById(user.id, {
      password: newPasswordHash,
    });
  }
}
