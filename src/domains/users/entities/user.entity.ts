import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Name } from './name.entity';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';

@Entity()
export class User extends BaseEntity {
  @Column({
    nullable: false,
    length: 64,
  })
  email: string;

  @Exclude()
  @Column({
    nullable: false,
    length: 32,
  })
  password: string;

  @Column(() => Name, {
    prefix: false,
  })
  name: Name;

  @Column({
    nullable: true,
  })
  profilePath: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  static async from({
    email,
    password,
    name,
    profilePath,
  }: {
    email: string;
    password: string;
    name: Name;
    profilePath?: string;
  }) {
    const user = new User();
    user.email = email;
    user.password = await user.hashPassword(password);
    user.name = name;
    user.profilePath = profilePath || null;

    return user;
  }

  async update(dto: UpdateUserDto): Promise<User> {
    this.name = dto.name;
    this.profilePath = dto.profilePath;

    return this;
  }

  public equals(user: User): boolean {
    return this.id === user.id;
  }

  public hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  public async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const equalPassword = await bcrypt.compareSync(password, hashedPassword);

    if (!equalPassword) {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }
  }
}
