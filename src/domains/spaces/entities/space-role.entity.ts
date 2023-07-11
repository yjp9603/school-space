import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { RoleType } from '../constants/constants';
import { Space } from 'src/domains/spaces/entities/space.entity';
import { IsEnum } from 'class-validator';
@Entity()
export class SpaceRole extends BaseEntity {
  @Column()
  roelName: string;

  @Column({
    type: 'varchar',
  })
  @IsEnum(RoleType)
  type: RoleType;

  @Column()
  spaceId: number;

  @ManyToOne(() => Space, (space) => space.spaceRoles)
  space: Space;
}
