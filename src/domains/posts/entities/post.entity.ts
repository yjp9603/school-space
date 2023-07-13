import { User } from './../../users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from 'src/common/entity/base.entity';
import { Space } from 'src/domains/spaces/entities/space.entity';
import { PostType } from '../constants/constants';
import { RoleType } from 'src/domains/spaces/constants/constants';
import { Chat } from 'src/domains/chats/entities/chat.entity';
@Entity()
export class Post extends BaseEntity {
  @Column()
  content: string;

  @Column()
  isAnonymous: boolean;

  @Column({
    comment: 'sqlite 에서는 enum 타입을 지원하지 않아 varchar 로 대체',
    type: 'varchar',
    default: PostType.QUESTION,
  })
  postType: PostType;

  @Column()
  authorRoleType: RoleType;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Space)
  space: Space;

  @ManyToOne(() => Chat)
  chat: Chat;

  canDeletePost(currentUserId: number, currentUserRoleType: RoleType): boolean {
    return (
      currentUserRoleType === RoleType.ADMIN || currentUserId === this.author.id
    );
  }
}
