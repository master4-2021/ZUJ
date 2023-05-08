import { INestApplicationContext } from '@nestjs/common';
import { createRootUser } from '../modules/database/seeds/rootUser';
import { EncryptionAndHashService } from '../modules/encryptionAndHash/encryptionAndHash.service';
import { LoggerService } from '../modules/logger/logger.service';
import { UserEntity } from '../modules/entities/user/user.entity';
import { generateCode } from '../utils/codeGenerator';
import { logWrapper } from './logWrapper';
import createTournaments from '../modules/database/seeds/tournaments';
import { TournamentEntity } from '../modules/entities/tournament/tournament.entity';
import { ClubEntity } from '../modules/entities/club/club.entity';
import createClubs from '../modules/database/seeds/clubs';
import createFixtures from '../modules/database/seeds/fixtures';
import { FixtureEntity } from '../modules/entities/fixture/fixture.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const LOG_CONTEXT = 'Database initialization';

async function initDb(appModule: INestApplicationContext) {
  const userRepository = appModule.get(getRepositoryToken(UserEntity));
  const hashService = appModule.get(EncryptionAndHashService);
  const logger = appModule.get(LoggerService);
  const clubRepository = appModule.get(getRepositoryToken(ClubEntity));
  const tournamentRepository = appModule.get(
    getRepositoryToken(TournamentEntity),
  );
  const fixtureRepository = appModule.get(getRepositoryToken(FixtureEntity));
  logger.setLogId(generateCode({ length: 8 }));

  logger.log_('Initialize database...', LOG_CONTEXT);

  await logWrapper<UserEntity>(
    logger,
    createRootUser,
    [userRepository, hashService],
    'Create root user',
  );

  await logWrapper<TournamentEntity[]>(
    logger,
    createTournaments,
    [tournamentRepository],
    'Create tournaments',
  );

  await logWrapper<ClubEntity[]>(
    logger,
    createClubs,
    [clubRepository, tournamentRepository],
    'Create clubs',
  );

  await logWrapper<FixtureEntity[]>(
    logger,
    createFixtures,
    [fixtureRepository, tournamentRepository],
    'Create fixtures',
  );

  logger.log_('Initialize database successfully!', LOG_CONTEXT);
}

export { initDb };
