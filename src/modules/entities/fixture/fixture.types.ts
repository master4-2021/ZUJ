import { FixtureEntity } from './fixture.entity';

export type CalendarQuery = {
  from: string;
  to: string;
};

export enum FixtureStatus {
  LIVE = 'live',
  UPCOMING = 'upcoming',
  FINISHED = 'finished',
  SCHEDULED = 'scheduled',
}

export type FixturePayload = FixtureEntity;

export type FixtureCarendarPayload = string[];
