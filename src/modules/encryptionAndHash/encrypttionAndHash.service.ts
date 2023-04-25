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

@Injectable()
export class EncryptionAndHashService {
  private readonly saltOrRounds: number;
  private readonly encryptionSecret: string;
  private cipher: Cipher;
  private decipher: Decipher;
  private readonly iv: Buffer;
  constructor(private readonly configService: ConfigService) {
    this.encryptionSecret = this.configService.get<string>(
      'encryptionAndHash.encryptionSecret',
    );
    this.saltOrRounds = this.configService.get<number>(
      'encryptionAndHash.hashSaltOrRound',
    );

    this.iv = randomBytes(16);
  }

  async encrypt(value: string): Promise<string> {
    await this.init();

    return Buffer.concat([
      this.cipher.update(value),
      this.cipher.final(),
    ]).toString('base64');
  }

  async decrypt(value: string): Promise<string> {
    await this.init();

    const valueBuffer = Buffer.from(value, 'base64');
    return Buffer.concat([
      this.decipher.update(valueBuffer),
      this.decipher.final(),
    ]).toString();
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.saltOrRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  private async init(): Promise<void> {
    const key = (await promisify(scrypt)(
      this.encryptionSecret,
      'salt',
      32,
    )) as Buffer;

    this.cipher = createCipheriv('aes-256-ctr', key, this.iv);
    this.decipher = createDecipheriv('aes-256-ctr', key, this.iv);
  }
}
