import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
