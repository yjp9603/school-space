import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async existByEmail(email: string): Promise<boolean> {
    const user = await this.count({
      where: {
        email: email,
      },
    });
    return !!user;
  }

  async findByUserId(userId: number): Promise<User> {
    const user = await this.findOne({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async updatePasswordByUserId(userId: number, newPassword: string) {
    await this.update({ id: userId }, { password: newPassword });
  }

  // 유저가 현재 스페이스에서의 권한을 가져옴 User-userSpace-Space-SpaceRole
  async getSpaceRoleBySpaceIdAndUserId(
    userId: number,
    spaceId: number,
  ): Promise<User> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.space', 'space')
      .leftJoinAndSelect('spaceUser.spaceRole', 'spaceRole')
      .where('user.id = :userId', { userId })
      .andWhere('space.id = :spaceId', { spaceId })
      .getOne();
  }

  // 유저가 해당 스페이스에 속해있는지 확인
  async checkUserofSpace(userId: number, spaceId: number): Promise<boolean> {
    const user = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.space', 'space')
      .where('user.id = :userId', { userId })
      .andWhere('space.id = :spaceId', { spaceId })
      .getOne();

    return !!user;
  }
}
