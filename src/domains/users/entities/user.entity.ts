import BaseEntity from 'src/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({
    nullable: false,
    length: 64,
  })
  email: string;

  @Column({
    nullable: false,
    length: 64,
  })
  password: string;

  @Column(() => Name)
  name: Name;

  @Column({
    nullable: true,
    default: null,
  })
  profilePath: string;

  @Column()
  refreshToken: string;

  static from(params: {
    email: string;
    password: string;
    name: Name;
    profilePath: string;
    refreshToken: string;
  }) {
    const user = new User();
    user.email = params.email;
    user.password = params.password;
    user.name = params.name;
    user.profilePath = params.profilePath;
    user.refreshToken = params.refreshToken;
  }

  update(params: {
    email: string;
    password: string;
    name: Name;
    profilePath: string;
    refreshToken: string;
  }) {
    this.email = params.email;
    this.password = params.password;
    this.name = params.name;
    this.profilePath = params.profilePath;
    this.refreshToken = params.refreshToken;
  }
}

export class Name {
  @Column({
    nullable: false,
    length: 32,
  })
  firstName: string;

  @Column({
    nullable: false,
    length: 32,
  })
  lastName: string;
}
