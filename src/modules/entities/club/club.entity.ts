import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { TournamentEntity } from '../tournament/tournament.entity';
import { FixtureEntity } from '../fixture/fixture.entity';
import { Region } from '../../../common/types';

@Entity('club')
export class ClubEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column()
  logo: string;

  @Column('enum', { enum: Region })
  region: Region;

  @ManyToMany(() => TournamentEntity, (tournament) => tournament.clubs)
  @JoinTable({
    name: 'club_tournament',
    joinColumn: {
      name: 'clubId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tournamentId',
      referencedColumnName: 'id',
    },
  })
  tournaments?: TournamentEntity[];

  @OneToMany(() => FixtureEntity, (fixture) => fixture.home)
  homeFixtures?: FixtureEntity[];

  @OneToMany(() => FixtureEntity, (fixture) => fixture.away)
  awayFixtures?: FixtureEntity[];
}
