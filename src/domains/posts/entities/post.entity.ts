import { RoleType } from './../../spaces/constants/constants';
import { User } from './../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from 'src/common/entity/base.entity';
import { Space } from 'src/domains/spaces/entities/space.entity';
import { PostType } from '../constants/constants';
import { ForbiddenException } from '@nestjs/common';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { PostListDto } from '../dtos/post-list.dto';
import { Name } from 'src/domains/users/entities/name.entity';
import { SpaceRole } from 'src/domains/spaces/entities/space-role.entity';
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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'space_id' })
  space: Space;

  static from({
    content,
    isAnonymous,
    type,
    user,
    space,
    userRoleType,
  }: {
    content: string;
    isAnonymous: boolean;
    type: PostType;
    user: User;
    space: Space;
    userRoleType: RoleType;
  }) {
    const post = new Post();

    // 2. 공지사항을 작성할 수 있는 어드민 유저인지
    if (userRoleType !== RoleType.ADMIN && type === PostType.NOTICE) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }

    // 3. 익명 유저로 작성할 수 있는 참여자인지
    if (userRoleType !== RoleType.PARTICIPANT && isAnonymous === true) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN_ANONYMOUS);
    }

    post.content = content;
    post.isAnonymous = isAnonymous;
    post.type = type;
    post.author = user;
    post.space = space;

    return post;
  }

  requiredAnonymousUserName(userId: number, userRoleType: RoleType) {
    if (
      this.isAnonymous &&
      userId !== this.author.id &&
      userRoleType !== RoleType.ADMIN
    ) {
      return true;
    }
    return false;
  }

  isAuthor(userId: number): boolean {
    return this.author.id === userId;
  }
}
