import { User } from './../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from 'src/core/entity/base.entity';
import { SpaceUser } from './space-user.entity';
import { SpaceRole } from './space-role.entity';
import { RoleType } from '../constants/constants';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.space, { cascade: true })
  spaceRoles: SpaceRole[];

  @OneToMany(() => SpaceUser, (spaceUser) => spaceUser.space, { cascade: true })
  spaceUsers: SpaceUser[];

  static from({
    spaceName,
    logo,
    adminCode,
    accessCode,
    user,
    roles,
  }: {
    spaceName: string;
    logo: string;
    adminCode: string;
    accessCode: string;
    user: User;
    roles: { roleName: string; type: RoleType }[];
  }) {
    const space = new Space();
    space.spaceName = spaceName;
    space.logo = logo;
    space.adminCode = adminCode;
    space.accessCode = accessCode;

    const spaceRoles = roles.map((role) => {
      const spaceRole = SpaceRole.from(role.roleName, role.type);
      space.addSpaceRole(spaceRole);

      return spaceRole;
    });

    const spaceUser = SpaceUser.from(
      user,
      spaceRoles.find((role) => role.type === RoleType.ADMIN),
    );
    spaceUser.setOwner();
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

  private setSpaceRole(spaceRole: SpaceRole) {
    this.spaceRoles = [spaceRole];
  }

  public addSpaceRole(spaceRole: SpaceRole) {
    !this.spaceRoles
      ? this.setSpaceRole(spaceRole)
      : this.spaceRoles.push(spaceRole);
    spaceRole.setSpace(this);
  }

  public removeSpaceRole(spaceRoleId: number) {
    const spaceRole = this.spaceRoles.find((role) => role.id === spaceRoleId);
    if (!spaceRole) {
      throw new NotFoundException(
        `Cannot find SpaceRole with id: ${spaceRoleId}`,
      );
    }

    const isRoleInUse = this.spaceUsers.some(
      (user) => user.spaceRole.id === spaceRoleId,
    );
    if (isRoleInUse) {
      throw new BadRequestException(
        `Cannot delete role with id: ${spaceRoleId}, it is currently in use.`,
      );
    }

    this.spaceRoles = this.spaceRoles.filter((role) => role.id !== spaceRoleId);
  }
}
