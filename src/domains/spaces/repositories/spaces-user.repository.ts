import { EntityRepository, Repository } from 'typeorm';
import { SpaceUser } from '../entities/space-user.entity';

@EntityRepository(SpaceUser)
export class SpaceUserRepository extends Repository<SpaceUser> {}
