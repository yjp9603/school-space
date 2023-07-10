import { User } from '../entities/user.entity';
import { Name } from '../entities/name.entity';

export class UserInfoResponseDto {
  readonly id: number;

  readonly email: string;

  readonly name: Name;

  readonly profilePath: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(user: User, requestUser: User) {
    this.id = user.id;
    this.email = user.equals(requestUser) ? user.email : null;
    this.name = user.name;
    this.profilePath = user.profilePath;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
