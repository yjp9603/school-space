import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async existByEmail(email: string): Promise<User> {
    const existEmail = await this.findOne({
      where: { email },
    });
    return existEmail;
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
