import { Injectable } from '@nestjs/common';
import {
  Cipher,
  createCipheriv,
  createDecipheriv,
  Decipher,
  randomBytes,
  scrypt,
} from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EncryptionPayload } from './types';

@Injectable()
export class EncryptionAndHashService {
  private readonly saltOrRounds: number;
  private readonly encryptionSecret: string;
  constructor(private readonly configService: ConfigService) {
    this.encryptionSecret = this.configService.get<string>(
      'encryptionAndHash.encryptionSecret',
    );
    this.saltOrRounds = this.configService.get<number>(
      'encryptionAndHash.hashSaltOrRound',
    );
  }

  async encrypt(value: string): Promise<EncryptionPayload> {
    const { iv, cipher } = await this.initCipher();

    return {
      iv,
      encryptedData: Buffer.concat([
        cipher.update(value),
        cipher.final(),
      ]).toString('base64'),
    };
  }

  async decrypt(value: string, iv: string): Promise<string> {
    const decipher = await this.initDecipher(iv);

    const valueBuffer = Buffer.from(value, 'base64');
    return Buffer.concat([
      decipher.update(valueBuffer),
      decipher.final(),
    ]).toString();
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.saltOrRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  private async initCipher(): Promise<{ cipher: Cipher; iv: string }> {
    const iv = randomBytes(16);

    const key = (await promisify(scrypt)(
      this.encryptionSecret,
      'salt',
      32,
    )) as Buffer;

    const cipher = createCipheriv('aes-256-ctr', key, iv);

    return { cipher, iv: iv.toString('hex') };
  }

  private async initDecipher(iv: string): Promise<Decipher> {
    const key = (await promisify(scrypt)(
      this.encryptionSecret,
      'salt',
      32,
    )) as Buffer;

    return createDecipheriv('aes-256-ctr', key, Buffer.from(iv, 'hex'));
  }
}
