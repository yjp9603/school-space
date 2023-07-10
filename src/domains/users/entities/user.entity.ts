import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
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

  static async from(dto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = dto.email;
    user.password = await user.hashPassword(dto.password);
    user.name = dto.name;
    user.profilePath = dto.profilePath || null;

    return user;
  }

  async update(dto: UpdateUserDto): Promise<User> {
    this.name = dto.name;
    this.profilePath = dto.profilePath;

    return this;
  }

  private hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  // private async comparePassword(
  //   password: string,
  //   hashPassword: string,
  // ): Promise<boolean> {
  //   return await bcrypt.compareSync(password, hashPassword);
  // }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const equalPassword = await bcrypt.compareSync(password, hashedPassword);

    if (!equalPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }
}
