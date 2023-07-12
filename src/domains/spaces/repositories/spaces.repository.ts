import { EntityRepository, Repository } from 'typeorm';
import { Space } from '../entities/space.entity';
import { PageRequest } from 'src/common/page';

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {
  findAndCountByUserId(userId: number, pageRequest: PageRequest) {
    return this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.user', 'user')
      .where('user.id = :userId', { userId })
      .take(pageRequest.offset)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
