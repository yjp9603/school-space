import { EntityRepository, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostPageRequest } from '../dtos/post.pagination';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async findAndCountBySpaceId(pageRequest: PostPageRequest, spaceId: number) {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.space', 'space')
      .innerJoinAndSelect('post.author', 'user')
      .where('space.id = :spaceId', { spaceId })
      .orderBy('post.id', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }

  async findPostAuthorAndSpaceByPostId(postId: number) {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.space', 'space')
      .innerJoinAndSelect('post.author', 'user')
      .where('post.id = :postId', { postId })
      .getOne();
  }

  async findSpaceRoleByPostIdAndUserId(postId: number, userId: number) {
    return await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.space', 'space')
      .leftJoinAndSelect('space.spaceUsers', 'spaceUser')
      .leftJoinAndSelect('spaceUser.user', 'user')
      .leftJoinAndSelect('spaceUser.spaceRole', 'spaceRole')
      .where('post.id = :postId', { postId })
      .andWhere('user.id = :userId', { userId })
      .getOne();
  }
}
