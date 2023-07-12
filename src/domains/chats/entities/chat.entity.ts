import BaseEntity from 'src/common/entity/base.entity';
import { Post } from 'src/domains/posts/entities/post.entity';
import { User } from 'src/domains/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @Column({
    nullable: false,
  })
  content: string;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => User)
  author: User;

  @JoinColumn({ name: 'parent_id' })
  @ManyToOne(() => Chat)
  private parent: Chat;

  @OneToMany(() => Chat, (child) => child.parent)
  private child: Chat[];
}
