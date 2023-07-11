import { Space } from './space.entity';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class SpaceUser extends BaseEntity {
  // @Column()
  // userId: number;

  // @Column()
  // spaceId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Space)
  space: Space;

  static from(user: User) {
    const spaceUser = new SpaceUser();
    spaceUser.user = user;

    return spaceUser;
  }

  public setSpace(space: Space) {
    this.space = space;
  }
}
