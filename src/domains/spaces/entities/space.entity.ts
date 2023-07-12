import { User } from './../../users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from 'src/common/entity/base.entity';
import { SpaceUser } from './space-user.entity';
import { SpaceRole } from './space-role.entity';
import { RoleType } from '../constants/constants';
import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { UpdateSpaceDto } from '../dto/update-space.dto';
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

  update(dto: UpdateSpaceDto) {
    this.spaceName = dto.spaceName;
    this.logo = dto.logo;
    return this;
  }

  public validateUserAsOwner(userId: number) {
    const isOwner = this.spaceUsers.some(
      (spaceUser) => spaceUser.user.id === userId && spaceUser.isOwner,
    );

    if (!isOwner) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }
  }
}
