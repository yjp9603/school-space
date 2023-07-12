import { Space } from './space.entity';
import BaseEntity from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SpaceRole } from './space-role.entity';
import { RoleType } from '../constants/constants';

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

  public setOwner(spaceRoles: SpaceRole[]) {
    this.isOwner = true;
    const adminRole = spaceRoles.find((role) => role.type === RoleType.ADMIN);
    if (adminRole) {
      this.spaceRole = adminRole;
    }
  }

  public setRole(spaceRole: SpaceRole) {
    this.spaceRole = spaceRole;
  }

  public setAsOwner() {
    this.isOwner = true;
  }
}
