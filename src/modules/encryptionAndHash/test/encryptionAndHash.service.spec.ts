import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { EncryptionAndHashService } from '../encrypttionAndHash.service';

describe('EncryptionAndHashService', () => {
  let encryptionAndHashService: EncryptionAndHashService;

  let value: string;

  beforeEach(async () => {
    value = 'value';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionAndHashService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'encryptionAndHash.encryptionSecret') {
                return 'test-encryption-secret';
              }
              if (key === 'encryptionAndHash.hashSaltOrRound') {
                return 10;
              }
            }),
          },
        },
      ],
    }).compile();

    encryptionAndHashService = module.get<EncryptionAndHashService>(
      EncryptionAndHashService,
    );
  });

  it('should be defined', () => {
    expect(encryptionAndHashService).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt a string', async () => {
      expect(await encryptionAndHashService.encrypt(value)).not.toEqual(value);
    });
  });

  describe('decrypt', () => {
    it('should decrypt an encrypted string', async () => {
      const { encryptedData, iv } = await encryptionAndHashService.encrypt(
        value,
      );

      expect(await encryptionAndHashService.decrypt(encryptedData, iv)).toEqual(
        value,
      );
    });
  });

  describe('hash', () => {
    it('should hash a string', async () => {
      expect(await encryptionAndHashService.hash(value)).not.toEqual(value);
    });
  });

  describe('compare', () => {
    it('should compare a value with its hashed version', async () => {
      const hashedValue = await encryptionAndHashService.hash(value);

      expect(
        await encryptionAndHashService.compare(value, hashedValue),
      ).toEqual(true);
    });

    it('should return false for non-matching values', async () => {
      const otherValue = 'other-value';
      const hashedValue = await bcrypt.hash(value, 10);

      expect(
        await encryptionAndHashService.compare(otherValue, hashedValue),
      ).toEqual(false);
    });
  });
});
