import { PostRepository } from './../posts/repositories/post.repository';
import { ChatRepository } from './repositories/chat.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/repositories/user.repository';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { Chat } from './entities/chat.entity';
import { RoleType } from '../spaces/constants/constants';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async create(dto: CreateChatDto, userId: number) {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const post = await this.postRepository.findSpaceRoleByPostIdAndUserId(
      dto.postId,
      userId,
    );
    if (!post) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_POST);
    }
    console.log('post::', post);

    const roleType = post.space.spaceUsers[0].spaceRole.type;
    console.log('roleType::', roleType);

    let parentId;

    if (dto.parentId) {
      await this.chatRepository.findOne({
        where: {
          id: dto.parentId,
        },
      });
      if (!parentId) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_CHAT);
      }
    }

    const chat = Chat.from({
      content: dto.content,
      isAnonymous: dto.isAnonymous,
      post,
      user,
      parentId: dto.parentId,
      roleType: roleType,
    });

    await this.chatRepository.save(chat);

    if (!dto.parentId) {
      chat.parentId = chat.id;
      await this.chatRepository.update(chat.id, { parentId: chat.id });
    }

    return chat.id;
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
