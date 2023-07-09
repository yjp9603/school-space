import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { RoleType } from '../constants/constants';
@Entity()
export class SpaceRole extends BaseEntity {
  @Column()
  private name: string;

  @Column({
    type: 'varchar',
    enum: RoleType,
  })
  private type: RoleType;
}
