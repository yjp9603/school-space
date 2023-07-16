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
      .orderBy('space.id', pageRequest.order)
      .take(pageRequest.limit)
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

  async findSpaceByJoinCode(joinCode: string, userId: number) {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect(
        'space.spaceUsers',
        'spaceUser',
        'spaceUser.user_id = :userId',
        { userId },
      )
      .leftJoinAndSelect('space.spaceRoles', 'spaceRole')
      .where('space.adminCode = :joinCode OR space.accessCode = :joinCode', {
        joinCode,
      })
      // .andWhere('spaceUser.user_id = :userId', { userId })
      .getOne();
  }

  async getUsersSpaceRoleBySpaceId(spaceId: number) {
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

  async findSpaceWithUsersById(spaceId: number) {
    return await this.createQueryBuilder('space')
      .innerJoinAndSelect('space.spaceUsers', 'spaceUsers')
      .where('space.id = :spaceId', { spaceId })
      .getOne();
  }

  async findSpaceRoleBySpaceId(spaceId: number, userId: number) {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.spaceRole', 'spaceRole')
      .where('space.id = :spaceId', { spaceId })
      .andWhere('spaceUser.user_id = :userId', { userId })
      .getOne();
  }
}
