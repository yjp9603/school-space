import { User } from './../../users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import BaseEntity from 'src/core/entity/base.entity';
import { Space } from 'src/domains/spaces/entities/space.entity';
@Entity()
export class Post extends BaseEntity {
  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Space)
  space: Space;
}
