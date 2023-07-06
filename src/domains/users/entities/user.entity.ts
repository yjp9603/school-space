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

  @Column({
    nullable: true,
    default: null,
  })
  profilePath: string;

  @Column({
    nullable: true,
    default: null,
  })
  refreshToken: string;
}
