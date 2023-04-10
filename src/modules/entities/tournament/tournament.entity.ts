import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { ClubEntity } from '../club/club.entity';
import { FixtureEntity } from '../fixture/fixture.entity';
import { Region } from '../../../common/types';

@Entity('tournament')
export class TournamentEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column('enum', { enum: Region })
  region: Region;

  @Column()
  code: string;

  @Column()
  logo: string;

  @ManyToMany(() => ClubEntity, (club) => club.tournaments)
  clubs?: ClubEntity[];

  @OneToMany(() => FixtureEntity, (fixture) => fixture.tournament)
  fixtures?: FixtureEntity[];
}
