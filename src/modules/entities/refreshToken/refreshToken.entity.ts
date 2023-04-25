import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { UserEntity } from '../user/user.entity';

@Entity('token')
export class RefreshTokenEntity extends BaseEntity {
  @Column('longtext')
  refreshToken: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  refreshExpiresIn: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user?: Partial<UserEntity>;
}
