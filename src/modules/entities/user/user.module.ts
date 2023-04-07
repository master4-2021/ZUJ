import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionAndHashModule } from '../../encryptionAndHash/encryptionAndHash.module';
import { FilterModule } from '../../filter/filter.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    FilterModule,
    TypeOrmModule.forFeature([UserEntity]),
    EncryptionAndHashModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
