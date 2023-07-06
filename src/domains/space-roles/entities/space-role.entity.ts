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

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
}
