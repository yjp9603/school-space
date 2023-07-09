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
}
