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
}
