import { FixtureStatus, Region } from '../../../common/types';
import { promiseWhile } from '../../../utils/promiseWhile';
import { ClubEntity } from '../../entities/club/club.entity';
import { FixtureEntity } from '../../entities/fixture/fixture.entity';
import { FixtureService } from '../../entities/fixture/fixture.service';
import { TournamentService } from '../../entities/tournament/tournament.service';

const countryTournamentTimes = [
  {
    day: 'Saturday',
    time: [21, 0],
  },
  {
    day: 'Saturday',
    time: [23, 0],
  },
  {
    day: 'Sunday',
    time: [1, 0],
  },
  {
    day: 'Sunday',
    time: [21, 0],
  },
  {
    day: 'Sunday',
    time: [23, 0],
  },
];

const continentTournamentTimes = [
  {
    day: 'Thursday',
    time: [2, 0],
  },
  {
    day: 'Thursday',
    time: [4, 0],
  },
  {
    day: 'Friday',
    time: [2, 0],
  },
  {
    day: 'Friday',
    time: [4, 0],
  },
];

function getKickoffTimes(region: Region) {
  return region === Region.EU
    ? continentTournamentTimes
    : countryTournamentTimes;
}

function getDateTime(day: string, time: number[]): Date[] {
  const startDate = new Date(2023, 3, 1); // April 1, 2023
  const endDate = new Date(2023, 4, 31); // May 31, 2023

  const result = [];
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = daysOfWeek.filter(
      (_day, index) => d.getDay() === index,
    )?.[0];

    if (day === dayOfWeek) {
      result.push(
        new Date(d.getFullYear(), d.getMonth(), d.getDate(), ...time),
      );
    }
  }

  return result;
}

function getKickoffDates(region: Region) {
  return getKickoffTimes(region)
    .map(({ day, time }) => {
      return getDateTime(day, time);
    })
    .flat();
}

function getRound(kickoffDate: Date, baseRound = 14) {
  const now = new Date();
  const diff = kickoffDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 3600 * 24));
  if (days < 0) {
    const round = baseRound - Math.ceil(Math.abs(days) / 7);
    return round < 0 ? 0 : round;
  }
  return Math.ceil(days / 7) + baseRound;
}

function getStatusAndScore(kickoffDate: Date): Partial<FixtureEntity> {
  const now = new Date();
  const diff = kickoffDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 3600 * 24));
  if (days < 0) {
    return {
      status: FixtureStatus.FINISHED,
      homeScore: Math.floor(Math.random() * 5),
      awayScore: Math.floor(Math.random() * 5),
    };
  }

  if (days === 0) {
    const mins = Math.ceil(diff / (1000 * 60));
    const liveScore = {
      homeScore: Math.floor(Math.random() * 5),
      awayScore: Math.floor(Math.random() * 5),
    };
    if (mins <= 0 && mins >= -90) {
      return {
        status: FixtureStatus.LIVE,
        homeScore: liveScore.homeScore,
        awayScore: liveScore.awayScore,
      };
    }

    if (mins < -90) {
      return {
        status: FixtureStatus.FINISHED,
        homeScore: liveScore.homeScore + Math.floor(Math.random() * 3),
        awayScore: liveScore.awayScore + Math.floor(Math.random() * 3),
      };
    }

    return { status: FixtureStatus.UPCOMING, homeScore: 0, awayScore: 0 };
  }

  return { status: FixtureStatus.SCHEDULED, homeScore: 0, awayScore: 0 };
}

function pairClubs(clubs: Partial<ClubEntity>[]): Partial<ClubEntity>[][] {
  const shuffled = clubs.slice(0);
  const pairs = [];
  let i = shuffled.length;
  while (i--) {
    const j = Math.floor((i + 1) * Math.random());
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  for (let i = 0; i < shuffled.length; i += 2) {
    pairs.push([shuffled[i], shuffled[i + 1]]);
  }
  return pairs;
}

async function createFixtures(
  fixtureService: FixtureService,
  tournamentService: TournamentService,
) {
  const tournaments = await tournamentService.findAll({
    relations: { clubs: true },
  });

  if (tournaments.length === 0) {
    throw new Error('Tournaments not found');
  }

  const fixtures: Partial<FixtureEntity>[] = [];

  await promiseWhile(
    (index) => index < tournaments.length,
    async (index) => {
      const tournament = tournaments[index];
      const kickoffDates = getKickoffDates(tournament.region);
      const pairs = pairClubs(tournament.clubs);

      pairs.forEach((pair, index) => {
        const kickoffDate = kickoffDates[index % kickoffDates.length];
        fixtures.push({
          tournamentId: tournament.id,
          homeId: pair[0].id,
          awayId: pair[1].id,
          kickoffTime: kickoffDate,
          round: getRound(kickoffDate),
          ...getStatusAndScore(kickoffDate),
        });
      });

      return index + 1;
    },
    0,
  );

  return await fixtureService.saveMany(fixtures);
}

export default createFixtures;
