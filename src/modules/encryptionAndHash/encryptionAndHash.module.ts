import { Module } from '@nestjs/common';
import { EncryptionAndHashService } from './encryptionAndHash.service';

@Module({
  imports: [],
  providers: [EncryptionAndHashService],
  exports: [EncryptionAndHashService],
})
export class EncryptionAndHashModule {}
