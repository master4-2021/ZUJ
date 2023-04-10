import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { ClubEntity } from '../club/club.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { FixtureStatus } from '../../../common/types';

@Entity('fixture')
export class FixtureEntity extends BaseEntity {
  @Column()
  tournamentId: string;

  @Column()
  homeId: string;

  @Column('int')
  homeScore: number;

  @Column()
  awayId: string;

  @Column('int')
  awayScore: number;

  @Column('datetime')
  kickoffTime: Date;

  @Column('int')
  round: number;

  @Column('enum', { enum: FixtureStatus, default: FixtureStatus.SCHEDULED })
  status: FixtureStatus;

  @ManyToOne(() => TournamentEntity, (tournament) => tournament.fixtures)
  @JoinColumn({ name: 'tournamentId' })
  tournament?: TournamentEntity;

  @ManyToOne(() => ClubEntity, (club) => club.homeFixtures)
  @JoinColumn({ name: 'homeId' })
  home?: ClubEntity;

  @ManyToOne(() => ClubEntity, (club) => club.awayFixtures)
  @JoinColumn({ name: 'awayId' })
  away?: ClubEntity;
}
