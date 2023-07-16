import BaseEntity from 'src/common/entity/base.entity';
import { Post } from 'src/domains/posts/entities/post.entity';
import { RoleType } from 'src/domains/spaces/constants/constants';
import { User } from 'src/domains/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @Column({
    comment: '댓글 내용',
    nullable: false,
  })
  content: string;

  @Column({
    comment: '익명 여부',
  })
  isAnonymous: boolean;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  author: User;

  @JoinColumn({ name: 'parent_id' })
  @ManyToOne(() => Chat)
  private parent: Chat;

  @OneToMany(() => Chat, (child) => child.parent)
  private child: Chat[];

  static from({
    content,
    isAnonymous,
    post,
    user,
    parent,
  }: {
    content: string;
    isAnonymous: boolean;
    post: Post;
    user: User;
    parent: Chat;
  }) {
    const chat = new Chat();
    chat.content = content;
    chat.isAnonymous = isAnonymous;
    chat.post = post;
    chat.author = user;
    chat.parent = parent || null;
    return chat;
  }

  isAllowedToDelete(userId: number, userRoleType: RoleType): boolean {
    return this.author.id === userId || userRoleType === RoleType.ADMIN;
  }
}
