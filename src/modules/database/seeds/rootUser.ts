import { Repository } from 'typeorm';
import { Role } from '../../../common/decorators/roles';
import { EncryptionAndHashService } from '../../encryptionAndHash/encryptionAndHash.service';
import { UserEntity } from '../../entities/user/user.entity';

const rootUser: UserEntity = {
  name: 'root',
  username: 'root',
  password: 'root',
  role: Role.ROOT,
};

async function createRootUser(
  repository: Repository<UserEntity>,
  hashService: EncryptionAndHashService,
): Promise<UserEntity> {
  const hashedPassword = await hashService.hash(rootUser.password);
  return repository.save({ ...rootUser, password: hashedPassword });
}

export { createRootUser };
