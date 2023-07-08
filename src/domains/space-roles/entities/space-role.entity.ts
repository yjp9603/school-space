import BaseEntity from 'src/base.entity';
import { Column, Entity } from 'typeorm';
import { RoleType } from '../constants/constants';
@Entity()
export class SpaceRole extends BaseEntity {
  @Column()
  private name: string;

  @Column({
    type: 'enum',
    enum: RoleType,
  })
  private type: RoleType;
}
