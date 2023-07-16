import { EntityRepository, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PageRequest } from 'src/common/page';
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
}
