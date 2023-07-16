import { User } from 'src/domains/users/entities/user.entity';
import { PostType } from '../constants/constants';
import { Post } from '../entities/post.entity';
export class PostListDto {
  id: number;
  content: string;
  type: PostType;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: { id: number; name: string };

  constructor(post: Post) {
    this.id = post.id;
    this.content = post.content;
    this.type = post.type;
    this.isAnonymous = post.isAnonymous;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.user = {
      id: post.author.id,
      name: `${post.author.name.firstName} ${post.author.name.lastName}`,
    };
  }
}
