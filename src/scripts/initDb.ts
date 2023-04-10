import { INestApplicationContext } from '@nestjs/common';
import { createRootUser } from '../modules/database/seeds/rootUser';
import { EncryptionAndHashService } from '../modules/encryptionAndHash/encrypttionAndHash.service';
import { LoggerService } from '../modules/logger/logger.service';
import { UserEntity } from '../modules/entities/user/user.entity';
import { UserService } from '../modules/entities/user/user.service';
import { generateCode } from '../utils/codeGenerator';
import { logWrapper } from './logWrapper';
import { ClubService } from '../modules/entities/club/club.service';
import { TournamentService } from '../modules/entities/tournament/tournament.service';
import createTournaments from '../modules/database/seeds/tournaments';
import { TournamentEntity } from '../modules/entities/tournament/tournament.entity';
import { ClubEntity } from '../modules/entities/club/club.entity';
import createClubs from '../modules/database/seeds/clubs';
import createFixtures from '../modules/database/seeds/fixtures';
import { FixtureEntity } from '../modules/entities/fixture/fixture.entity';
import { FixtureService } from '../modules/entities/fixture/fixture.service';

const LOG_CONTEXT = 'Database initialization';

async function initDb(appModule: INestApplicationContext) {
  const userService = appModule.get(UserService);
  const hashService = appModule.get(EncryptionAndHashService);
  const logger = appModule.get(LoggerService);
  const clubService = appModule.get(ClubService);
  const tournamentService = appModule.get(TournamentService);
  const fixtureService = appModule.get(FixtureService);
  logger.setLogId(generateCode({ length: 8 }));

  logger.log_('Initialize database...', LOG_CONTEXT);

  await logWrapper<UserEntity>(
    logger,
    createRootUser,
    [userService, hashService],
    'Create root user',
  );

  await logWrapper<TournamentEntity[]>(
    logger,
    createTournaments,
    [tournamentService],
    'Create tournaments',
  );

  await logWrapper<ClubEntity[]>(
    logger,
    createClubs,
    [clubService, tournamentService],
    'Create clubs',
  );

  await logWrapper<FixtureEntity[]>(
    logger,
    createFixtures,
    [fixtureService, tournamentService],
    'Create fixtures',
  );

  logger.log_('Initialize database successfully!', LOG_CONTEXT);
}

export { initDb };
