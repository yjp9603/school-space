import { ForbiddenException } from '@nestjs/common';
import BaseEntity from 'src/common/entity/base.entity';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
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

  @Column({
    comment: '부모 댓글 아이디, 댓글은 자신 아이디',
    nullable: true,
  })
  parentId: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  author: User;

  static from({
    content,
    isAnonymous,
    post,
    user,
    parentId,
    roleType,
  }: {
    content: string;
    isAnonymous: boolean;
    post: Post;
    user: User;
    parentId: number;
    roleType: RoleType;
  }) {
    const chat = new Chat();
    chat.content = content;
    chat.isAnonymous = chat.setAnonymous(isAnonymous, roleType);
    chat.post = post;
    chat.author = user;
    chat.parentId = parentId;

    return chat;
  }

  private setAnonymous(isAnonymous: boolean, roleType: RoleType): boolean {
    if (isAnonymous && roleType === RoleType.ADMIN) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN_ANONYMOUS);
    }

    return isAnonymous;
  }

  isAllowedToDelete(userId: number, userRoleType: RoleType): boolean {
    return this.author.id === userId || userRoleType === RoleType.ADMIN;
  }
}
