import { Column, Entity } from 'typeorm';
import { Role } from '../../../common/decorators/role';
import { BaseEntity } from '../../base/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;
}
