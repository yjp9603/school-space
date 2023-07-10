import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';

export class UserInfoResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  constructor(user: User) {
    super();
    (this.id = user.id),
      (this.email = user.email),
      (this.name = user.name),
      (this.profilePath = user.profilePath),
      (this.createdAt = user.createdAt),
      (this.updatedAt = user.updatedAt);
  }
}
