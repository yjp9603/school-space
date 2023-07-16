import { Type } from 'class-transformer';
import { PostType } from '../constants/constants';
import { Post } from '../entities/post.entity';
export class PostListDto {
  id: number;
  content: string;
  Type: PostType;
  isAnonymous: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(post: Post) {
    this.id = post.id;
    this.content = post.content;
    this.Type = post.type;
    this.isAnonymous = post.isAnonymous;
    this.userId = post.author.id;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
