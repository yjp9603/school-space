import { Space } from './../../spaces/entities/space.entity';
import BaseEntity from 'src/core/entity/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSpace extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Space)
  space: Space;
}
