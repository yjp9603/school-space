import { EntityRepository, Repository } from 'typeorm';
import { Space } from '../entities/space.entity';
import { PageRequest } from 'src/common/page';
import { SpaceRole } from '../entities/space-role.entity';

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

  async findOwnerBySpaceIdAndUserId(spaceId: number, userId: number) {
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

  async findSpaceWithRolesAndUsersById(spaceId: number) {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceRoles', 'spaceRoles')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUsers')
      .leftJoinAndSelect('spaceUsers.user', 'user')
      .where('space.id = :spaceId', { spaceId })
      .getOne();
  }

  async deleteRole(roleId: number) {
    return await this.createQueryBuilder()
      .softDelete()
      .from(SpaceRole)
      .where('id = :roleId', { roleId })
      .execute();
  }
}
