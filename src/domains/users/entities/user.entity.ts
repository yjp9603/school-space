import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { Name } from './name.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    nullable: false,
    length: 64,
  })
  email: string;

  @Column({
    nullable: false,
    length: 32,
  })
  password: string;

  @Column(() => Name)
  name: Name;

  @Column({
    nullable: true,
  })
  profilePath: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  static from(params: {
    email: string;
    password: string;
    name: Name;
    profilePath: string;
  }) {
    const user = new User();

    user.email = params.email;
    user.password = params.password;
    user.name = params.name;
    user.profilePath = params.profilePath;

    return user;
  }

  update(params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePath: string;
    refreshToken: string;
  }) {
    this.email = params.email;
    this.password = params.password;
    this.name.firstName = params.firstName;
    this.name.lastName = params.lastName;
    this.profilePath = params.profilePath;
    this.refreshToken = params.refreshToken;
  }
}
