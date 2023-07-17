import { UserRepository } from 'src/domains/users/repositories/user.repository';
import { UsersService } from './../users/users.service';
import { PostRepository } from './../posts/repositories/post.repository';
import { ChatRepository } from './repositories/chat.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dtos/create-chat.dto';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { Chat } from './entities/chat.entity';
import { RoleType } from '../spaces/constants/constants';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly postRepository: PostRepository,
    private readonly usersService: UsersService,
    private readonly userRepository: UserRepository,
  ) {}
  /**
   * 댓글 작성
   * @param dto CreateChatDto
   * @param userId
   * @returns chatId
   */
  async create(dto: CreateChatDto, userId: number) {
    const user = await this.usersService.validateUser(userId);

    const post = await this.validatePost(dto.postId, userId);

    const parentId = await this.validateParentChat(dto.parentId);

    const roleType = post.space.spaceUsers[0].spaceRole.type;

    let chat;
    chat = Chat.from({
      content: dto.content,
      isAnonymous: dto.isAnonymous,
      post,
      user,
      parentId,
      roleType: roleType,
    });

    // docs: 댓글은 자기 자신을 parentId로 가지는데, 트랜잭션을 최소화하기 위해 insert 사용
    if (!dto.parentId) {
      const insertResult = await this.chatRepository.insert(chat);
      const generatedId = insertResult.identifiers[0].id;
      chat = { ...chat, id: generatedId, parentId: generatedId };
    }

    await this.chatRepository.save(chat);

    return chat.id;
  }

  /**
   * 댓글 삭제 (관리자, 작성자만)
   * @param chatId
   * @param userId
   */
  async deleteChat(chatId: number, userId: number) {
    await this.usersService.validateUser(userId);

    const chat = await this.validateChat(chatId);

    const spaceId = chat.post.space.id;

    const userSpaceRole =
      await this.userRepository.getSpaceRoleBySpaceIdAndUserId(userId, spaceId);

    if (
      !userSpaceRole.hasRoleInSpace(spaceId, RoleType.ADMIN) &&
      !chat.isAuthor(userId)
    ) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }

    await this.chatRepository.softDelete(chatId);
  }

  private async validatePost(postId: number, userId: number) {
    const post = await this.postRepository.findSpaceRoleByPostIdAndUserId(
      postId,
      userId,
    );
    if (!post) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_POST);
    }
    return post;
  }

  private async validateParentChat(parentId: number) {
    if (parentId) {
      const parentChat = await this.chatRepository.findOne({
        where: {
          id: parentId,
        },
      });
      if (!parentChat) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_CHAT);
      }
      return parentId;
    }
    return null;
  }

  async validateChat(chatId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: {
        id: chatId,
      },
      relations: ['post', 'post.space', 'author'],
    });

    if (!chat) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_CHAT);
    }

    return chat;
  }
}
