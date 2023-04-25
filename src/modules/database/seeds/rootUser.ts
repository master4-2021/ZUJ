import { Role } from '../../../common/decorators/roles';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { UserEntity } from '../../entities/user/user.entity';
import { UserService } from '../../entities/user/user.service';

const rootUser: UserEntity = {
  name: 'root',
  username: 'root',
  password: 'root',
  role: Role.ROOT,
};

async function createRootUser(
  userService: UserService,
  hashService: EncryptionAndHashService,
): Promise<UserEntity> {
  const existedRoot = await userService.findOne({
    where: [{ username: rootUser.username }],
  });
  if (existedRoot) {
    await userService.deleteById(existedRoot.id);
  }
  const hashedPassword = await hashService.hash(rootUser.password);
  return userService.save({ ...rootUser, password: hashedPassword });
}

export { createRootUser };
