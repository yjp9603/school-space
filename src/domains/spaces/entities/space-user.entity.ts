import { Space } from './space.entity';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SpaceRole } from './space-role.entity';

@Entity()
export class SpaceUser extends BaseEntity {
  @Column()
  isOwner: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Space, (space) => space.spaceUsers)
  space: Space;

  @ManyToOne(() => SpaceRole, { nullable: false })
  spaceRole: SpaceRole;

  static from(user: User, spaceRole: SpaceRole) {
    const spaceUser = new SpaceUser();
    spaceUser.user = user;
    spaceUser.spaceRole = spaceRole;

    return spaceUser;
  }

  public setSpace(space: Space) {
    this.space = space;
  }

  public setOwner() {
    this.isOwner = true;
  }
}
