import { User } from './../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from 'src/core/entity/base.entity';
import { SpaceUser } from './space-user.entity';
import { SpaceRole } from './space-role.entity';
@Entity()
export class Space extends BaseEntity {
  @Column({
    nullable: false,
  })
  spaceName: string;

  @Column({
    nullable: true,
    default: null,
  })
  logo: string;

  @Column()
  adminCode: string;

  @Column()
  accessCode: string;

  // @Column()
  // userId: number;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.space)
  spaceRoles: SpaceRole[];

  @OneToMany(() => SpaceUser, (spaceUser) => spaceUser.space, { cascade: true })
  spaceUsers: SpaceUser[];

  static from({
    spaceName,
    logo,
    adminCode,
    accessCode,
    // spaceUser,
    user,
  }: {
    spaceName: string;
    logo: string;
    adminCode: string;
    accessCode: string;
    // spaceUser: SpaceUser;
    user: User;
  }) {
    const space = new Space();
    space.spaceName = spaceName;
    space.logo = logo;
    space.adminCode = adminCode;
    space.accessCode = accessCode;
    space.owner = user;
    const spaceUser = SpaceUser.from(user);

    console.log('spaceUser::', spaceUser);
    space.addSpaceUser(spaceUser);

    return space;
  }

  private setSpaceUser(spaceUser: SpaceUser) {
    this.spaceUsers = [spaceUser];
  }

  public addSpaceUser(spaceUser: SpaceUser) {
    !this.spaceUsers
      ? this.setSpaceUser(spaceUser)
      : this.spaceUsers.push(spaceUser);
    spaceUser.setSpace(this);
  }
}
