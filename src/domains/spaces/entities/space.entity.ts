import { User } from './../../users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from 'src/base.entity';
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
  logoPath: string;

  @Column()
  adminCode: string;

  @Column()
  accessCode: string;

  @ManyToOne(() => User)
  user: User;
}
