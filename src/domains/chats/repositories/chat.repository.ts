import { EntityRepository, Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { PageRequest } from 'src/common/page';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  async findAndCountByPostId(postId: number, pageRequest: PageRequest) {
    return await this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.author', 'author')
      .leftJoinAndSelect('chat.post', 'post')
      .where('post.id = :postId', { postId })
      .orderBy('chat.id', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
