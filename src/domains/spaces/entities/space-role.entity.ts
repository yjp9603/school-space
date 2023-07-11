import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RoleType } from '../constants/constants';
import { Space } from 'src/domains/spaces/entities/space.entity';
import { IsEnum } from 'class-validator';
@Entity()
export class SpaceRole extends BaseEntity {
  @Column()
  roleName: string;

  @Column({
    type: 'varchar',
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
}
