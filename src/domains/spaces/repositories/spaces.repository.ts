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

  // space - spaceUser - user with spaceId and userId
  async findOwnerBySpaceIdAndUserId(
    spaceId: number,
    userId: number,
  ): Promise<Space> {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.user', 'user')
      .where('space.id = :spaceId', { spaceId })
      .andWhere('user.id = :userId', { userId })
      .getOne();
  }

  async findSpaceByJoinCode(joinCode: string, userId: number): Promise<Space> {
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

  // space - spaceRoles - spaceUsers - user with spaceId
  async getUsersSpaceRoleBySpaceId(spaceId: number): Promise<Space> {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceRoles', 'spaceRole')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.user', 'user')
      .where('space.id = :spaceId', { spaceId })
      .getOne();
  }

  async deleteRole(roleId: number): Promise<any> {
    return await this.createQueryBuilder()
      .softDelete()
      .from(SpaceRole)
      .where('id = :roleId', { roleId })
      .execute();
  }

  // space - spaceUser - spaceRole with spaceId and userId
  async getSpaceRoleBySpaceIdAndUserId(
    spaceId: number,
    userId: number,
  ): Promise<Space> {
    return await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.spaceRole', 'spaceRole')
      .where('space.id = :spaceId', { spaceId })
      .andWhere('spaceUser.user_id = :userId', { userId })
      .getOne();
  }
}
