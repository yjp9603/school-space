import { EntityRepository, Repository } from 'typeorm';
import { Space } from '../entities/space.entity';
import { PageRequest } from 'src/common/page';

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {
  async findAndCountByUserId(userId: number, pageRequest: PageRequest) {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.user', 'user')
      .where('user.id = :userId', { userId })
      .take(pageRequest.offset)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }

  async findByUserId(userId: number) {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findSpaceUserBySpaceIdAndUserId(spaceId: number, userId: number) {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.user', 'user')
      .where('space.id = :spaceId', { spaceId })
      .andWhere('user.id = :userId', { userId })
      .getOne();
  }

  async findSpaceByJoinCode(joinCode: string) {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceRoles', 'spaceRole')
      .where('space.adminCode = :joinCode OR space.accessCode = :joinCode', {
        joinCode,
      })
      .getOne();
  }
}
