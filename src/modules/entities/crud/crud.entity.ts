import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { UserEntity } from '../user/user.entity';

@Entity('crud')
export class CrudEntity extends BaseEntity {
  @Column()
  displayName: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Partial<UserEntity>;
}
