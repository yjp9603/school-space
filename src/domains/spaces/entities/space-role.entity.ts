import BaseEntity from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RoleType } from '../constants/constants';
import { Space } from 'src/domains/spaces/entities/space.entity';
import { IsEnum } from 'class-validator';
import { PostType } from 'src/domains/posts/constants/constants';
import { ForbiddenException } from '@nestjs/common';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
@Entity()
export class SpaceRole extends BaseEntity {
  @Column({
    nullable: false,
  })
  roleName: string;

  @Column({
    comment: 'sqlite 에서는 enum 타입을 지원하지 않아 varchar 로 대체',
    type: 'varchar',
    nullable: false,
  })
  @IsEnum(RoleType)
  type: RoleType;

  @ManyToOne(() => Space, (space) => space.spaceRoles)
  space: Space;

  static from(roleName: string, type: RoleType) {
    const spaceRole = new SpaceRole();
    spaceRole.roleName = roleName;
    spaceRole.type = type;

    return spaceRole;
  }

  public setSpace(space: Space) {
    this.space = space;
  }

  public changeType(newType: RoleType) {
    this.type = newType;
  }

  public validatePostCreation(postType: PostType, isAnonymous: boolean): void {
    if (postType === PostType.NOTICE && this.type !== RoleType.ADMIN) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }
    if (isAnonymous && this.type !== RoleType.PARTICIPANT) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }
  }
}
