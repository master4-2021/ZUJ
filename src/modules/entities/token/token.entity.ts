import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { UserEntity } from '../user/user.entity';

@Entity('token')
export class TokenEntity extends BaseEntity {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  userId: string;

  @Column()
  refreshExpiresIn: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: Partial<UserEntity>;
}
