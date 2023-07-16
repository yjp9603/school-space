import { User } from './../../users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from 'src/common/entity/base.entity';
import { SpaceUser } from './space-user.entity';
import { SpaceRole } from './space-role.entity';
import { RoleType } from '../constants/constants';
import { v4 as uuidv4 } from 'uuid';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { Post } from 'src/domains/posts/entities/post.entity';
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

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.space, { cascade: true }) // Space 추가되면 SpaceRole도 추가
  spaceRoles: SpaceRole[];

  @OneToMany(() => SpaceUser, (spaceUser) => spaceUser.space, { cascade: true }) // Space 추가되면 SpaceUser도 추가
  spaceUsers: SpaceUser[];

  // @OneToMany(() => Post, (post) => post.space)
  // posts: Post[];

  static from({
    spaceName,
    logo,
    user,
    roles,
  }: {
    spaceName: string;
    logo: string;
    user: User;
    roles: { roleName: string; type: RoleType }[];
  }): Space {
    const space = new Space();
    space.spaceName = spaceName;
    space.logo = logo;
    space.adminCode = uuidv4().substring(0, 8);
    space.accessCode = uuidv4().substring(0, 8);
    space.spaceRoles = roles.map((role) =>
      SpaceRole.from(role.roleName, role.type),
    );
    space.spaceUsers = [
      SpaceUser.from(
        user,
        space.spaceRoles.find((role) => role.type === RoleType.ADMIN),
      ),
    ];

    return space;
  }

  public addSpaceUser(spaceUser: SpaceUser) {
    this.spaceUsers.push(spaceUser);
    spaceUser.setSpace(this);
  }

  public addSpaceRole(spaceRole: SpaceRole) {
    this.spaceRoles.push(spaceRole);
    spaceRole.setSpace(this);
  }

  public validateUserAsOwner(userId: number) {
    const isOwner = this.spaceUsers.some(
      (spaceUser) => spaceUser.user.id === userId && spaceUser.isOwner,
    );

    if (!isOwner) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }
  }

  public changeRoleType(roleId: number, newType: RoleType): SpaceRole | null {
    const roleToChange = this.spaceRoles.find((role) => role.id === roleId);

    if (!roleToChange) {
      return null;
    }

    roleToChange.changeType(newType);
    return roleToChange;
  }

  public assignNewOwner(newOwnerId: number): void {
    const oldOwner = this.spaceUsers.find((spaceUser) => spaceUser.isOwner);
    const newOwner = this.spaceUsers.find(
      (spaceUser) => spaceUser.user.id === newOwnerId,
    );

    if (!newOwner) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    if (oldOwner === newOwner) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }

    oldOwner?.changeOwner(false);
    newOwner.changeOwner(true);
  }

  public getUserRoleInSpace(user: User): SpaceRole {
    // 스페이스 유저와 스페이스 사이의 관계를 찾아서 스페이스 유저의 역할을 반환
    const spaceUser = this.spaceUsers.find(
      (spaceUser) => spaceUser.user.id === user.id,
    );
    return spaceUser ? spaceUser.spaceRole : null;
  }
}
