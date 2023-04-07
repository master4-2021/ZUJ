import { INestApplicationContext } from '@nestjs/common';
import { createRootUser } from '../modules/database/seeds/rootUser';
import { EncryptionAndHashService } from '../modules/encryptionAndHash/encrypttionAndHash.service';
import { LoggerService } from '../modules/logger/logger.service';
import { UserEntity } from '../modules/entities/user/user.entity';
import { UserService } from '../modules/entities/user/user.service';
import { generateCode } from '../utils/codeGenerator';
import { logWrapper } from './logWrapper';

const LOG_CONTEXT = 'Database initialization';

async function initDb(appModule: INestApplicationContext) {
  const userService = appModule.get(UserService);
  const hashService = appModule.get(EncryptionAndHashService);
  const logger = appModule.get(LoggerService);
  logger.setLogId(generateCode({ length: 8 }));

  logger.log_('Initialize database...', LOG_CONTEXT);
  await logWrapper<UserEntity>(
    logger,
    createRootUser,
    [userService, hashService],
    'Create root user',
  );
  logger.log_('Initialize database successfully!', LOG_CONTEXT);
}

export { initDb };
