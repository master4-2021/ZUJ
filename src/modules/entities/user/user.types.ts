import { DeepHideOrOmit } from '../../../common/types';
import { UserEntity } from './user.entity';

export type UserPayload = DeepHideOrOmit<UserEntity, 'password', true>;
