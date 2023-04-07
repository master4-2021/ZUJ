import { Module } from '@nestjs/common';
import { EncryptionAndHashService } from './encrypttionAndHash.service';

@Module({
  imports: [],
  providers: [EncryptionAndHashService],
  exports: [EncryptionAndHashService],
})
export class EncryptionAndHashModule {}
