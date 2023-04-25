import { DateTime } from 'luxon';
import {
  CalendarQuery,
  FixtureCarendarPayload,
  FixtureStatus,
} from '../fixture.types';
import { ParsedFilterQuery } from '../../../filter/types';
import { FixtureEntity } from '../fixture.entity';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Region } from '../../tournament/tournament.types';

const mockFixtureCalendarQuery: CalendarQuery = {
  from: DateTime.fromObject({ year: 2023, month: 4, day: 1, hour: 0 }).toISO(),
  to: DateTime.fromObject({
    year: 2023,
    month: 4,
    day: 30,
    hour: 23,
    minute: 59,
    second: 59,
  }).toISO(),
};

const mockFixtureCalendarPayload: FixtureCarendarPayload = [
  DateTime.fromObject({ year: 2023, month: 4, day: 1, hour: 0 }).toISO(),
  DateTime.fromObject({ year: 2023, month: 4, day: 2, hour: 0 }).toISO(),
  DateTime.fromObject({ year: 2023, month: 4, day: 3, hour: 0 }).toISO(),
  DateTime.fromObject({ year: 2023, month: 4, day: 4, hour: 0 }).toISO(),
];

const mockFixtureFilter: ParsedFilterQuery<FixtureEntity> = {
  where: [
    {
      kickoffTime: And(
        MoreThanOrEqual(DateTime.now().startOf('week').toJSDate()),
        LessThanOrEqual(DateTime.now().endOf('week').toJSDate()),
      ),
    },
  ],
  relations: { tournament: true, home: true, away: true },
  order: { kickoffTime: 'ASC' },
};

const mockFixturePayload: FixtureEntity[] = [
  {
    id: '05fc8950-41e5-4ed0-aac7-db8eaddc53c4',
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    tournamentId: '43582522-5566-4378-9e4b-5dd0480a2a3e',
    homeId: '9dcee081-1b36-414f-9d5c-2155bd930210',
    homeScore: 0,
    awayId: '57451315-9217-4de8-9fce-4cc4525dc216',
    awayScore: 0,
    kickoffTime: DateTime.now().startOf('week').toJSDate(),
    round: 16,
    status: FixtureStatus.SCHEDULED,
    tournament: {
      id: '43582522-5566-4378-9e4b-5dd0480a2a3e',
      createdAt: DateTime.now().toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      name: 'Champions League',
      shortName: 'CL',
      region: Region.EU,
      code: 'cl_eu',
      logo: 'https://upload.wikimedia.org/wikipedia/en/6/67/UEFA_Champions_League_logo.svg',
    },
    home: {
      id: '9dcee081-1b36-414f-9d5c-2155bd930210',
      createdAt: DateTime.now().toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      name: 'Bayer Leverkusen',
      shortName: 'BAY',
      logo: 'https://upload.wikimedia.org/wikipedia/en/0/04/FC_Bayern_Munich_logo.svg',
      region: Region.DE,
    },
    away: {
      id: '57451315-9217-4de8-9fce-4cc4525dc216',
      createdAt: DateTime.now().toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      name: 'Borussia Dortmund',
      shortName: 'BVB',
      logo: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Borussia_Dortmund_logo.svg',
      region: Region.DE,
    },
  },
  {
    id: 'f6faf776-9b00-45b8-88ad-f9e04d4aa7d6',
    createdAt: DateTime.now().toJSDate(),
    updatedAt: DateTime.now().toJSDate(),
    tournamentId: 'bbaa47c8-e78f-4017-94cf-3a0b226a3f68',
    homeId: '257e861f-c8cb-44ba-8fb6-79925b2be808',
    homeScore: 0,
    awayId: '613fb761-7b2a-4294-a237-072f893eec1e',
    awayScore: 0,
    kickoffTime: DateTime.now().startOf('week').toJSDate(),
    round: 16,
    status: FixtureStatus.SCHEDULED,
    tournament: {
      id: 'bbaa47c8-e78f-4017-94cf-3a0b226a3f68',
      createdAt: DateTime.now().toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      name: 'Europa League',
      shortName: 'EL',
      region: Region.EU,
      code: 'el_eu',
      logo: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Europa_League_logo_2010.svg',
    },
    home: {
      id: '257e861f-c8cb-44ba-8fb6-79925b2be808',
      createdAt: DateTime.now().toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      name: 'Lazio',
      shortName: 'LAZ',
      logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Lazio_Rome.svg',
      region: Region.IT,
    },
    away: {
      id: '613fb761-7b2a-4294-a237-072f893eec1e',
      createdAt: DateTime.now().toJSDate(),
      updatedAt: DateTime.now().toJSDate(),
      name: 'AS Roma',
      shortName: 'ROM',
      logo: 'https://upload.wikimedia.org/wikipedia/en/f/f0/AS_Roma_Logo.svg',
      region: Region.IT,
    },
  },
];

export {
  mockFixtureCalendarQuery,
  mockFixtureCalendarPayload,
  mockFixtureFilter,
  mockFixturePayload,
};
