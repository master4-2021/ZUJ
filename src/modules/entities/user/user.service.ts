import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ErrorMessageEnum,
  UNAUTHORIZED,
} from '../../../common/constants/errors';
import { BusinessException } from '../../../common/exceptions';
import { BaseService } from '../../base/base.service';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { LoggerService } from '../../logger/logger.service';
import { ChangePasswordDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService extends BaseService<LoggerService, UserEntity> {
  constructor(
    logger: LoggerService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {
    super(userRepository, logger);
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

    const oldPasswordHash = await this.encryptionAndHashService.hash(
      oldPassword,
    );
    const isOldPasswordValid = await this.encryptionAndHashService.compare(
      oldPasswordHash,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new BusinessException(
        UNAUTHORIZED,
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
