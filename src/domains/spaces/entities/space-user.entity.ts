import { Space } from './space.entity';
import BaseEntity from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SpaceRole } from './space-role.entity';
import { RoleType } from '../constants/constants';

@Entity()
export class SpaceUser extends BaseEntity {
  @Column({ default: false })
  isOwner: boolean;

  @ManyToOne(() => User, (user) => user.spaceUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Space)
  space: Space;

  @ManyToOne(() => SpaceRole)
  spaceRole: SpaceRole;

  static from(user: User, spaceRole: SpaceRole) {
    const spaceUser = new SpaceUser();
    spaceUser.user = user;
    spaceUser.spaceRole = spaceRole;
    spaceUser.isOwner = spaceRole.type === RoleType.ADMIN;
    return spaceUser;
  }

  public setSpace(space: Space) {
    this.space = space;
  }

  public changeOwner(isOwner: boolean): void {
    this.isOwner = isOwner;
  }
}
