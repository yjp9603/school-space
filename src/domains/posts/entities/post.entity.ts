import { User } from './../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from 'src/common/entity/base.entity';
import { Space } from 'src/domains/spaces/entities/space.entity';
import { PostType } from '../constants/constants';
import { RoleType } from 'src/domains/spaces/constants/constants';
import { Chat } from 'src/domains/chats/entities/chat.entity';
@Entity()
export class Post extends BaseEntity {
  @Column({
    comment: '게시글 내용',
  })
  content: string;

  @Column({
    comment: '게시글 타입 (질문, 공지)',
    type: 'varchar',
    default: PostType.QUESTION,
  })
  type: PostType;

  @Column({
    comment: '익명 여부',
  })
  isAnonymous: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // 유저 - 포스트는 1:N 관계이므로 N쪽에 적용. 유저 삭제시 게시글 삭제
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ManyToOne(() => Space) // 스페이스 - 포스트는 1:N 관계이므로 N쪽에 적용. 공간 하나에 여러개의 게시글
  @JoinColumn({ name: 'space_id' })
  space: Space;

  static from({
    content,
    isAnonymous,
    type,
    user,
    space,
  }: {
    content: string;
    isAnonymous: boolean;
    type: PostType;
    user: User;
    space: Space;
  }) {
    const post = new Post();

    post.content = content;
    post.isAnonymous = isAnonymous;
    post.type = type;
    post.author = user;
    post.space = space;

    return post;
  }

  canDeletePost(currentUserId: number, currentUserRoleType: RoleType): boolean {
    return (
      currentUserRoleType === RoleType.ADMIN || currentUserId === this.author.id
    );
  }
}
