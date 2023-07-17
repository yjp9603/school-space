import { Page, PageRequest } from './../../common/page';
import { SpaceRepository } from './../spaces/repositories/spaces.repository';
import { PostRepository } from './repositories/post.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UserRepository } from '../users/repositories/user.repository';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { Post } from './entities/post.entity';
import { RoleType } from '../spaces/constants/constants';
import { Connection } from 'typeorm';
import { PostPageRequest } from './dtos/post.pagination';
import { PostListDto } from './dtos/post-list.dto';
import { UsersService } from '../users/users.service';
import { ChatRepository } from '../chats/repositories/chat.repository';
import { ChatListDto } from '../chats/dtos/chat-list.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly spaceRepository: SpaceRepository,
    private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly chatRepository: ChatRepository,
  ) {}
  /**
   * 참여중인 스페이스의 게시글 작성
   * @param dto
   * @param userId
   * return postId
   */
  async createPost(dto: CreatePostDto, userId: number) {
    await this.connection.transaction(async () => {
      const user = await this.userRepository.findByUserId(userId);
      if (!user) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
      }

      const targetSpace =
        await this.spaceRepository.getSpaceRoleBySpaceIdAndUserId(
          dto.spaceId,
          userId,
        );
      if (!targetSpace) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SPACE);
      }
      if (!targetSpace.spaceUsers || targetSpace.spaceUsers.length === 0) {
        throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
      }

      const userRoleType = targetSpace.spaceUsers[0].spaceRole.type;

      const post = Post.from({
        content: dto.content,
        type: dto.type,
        isAnonymous: dto.isAnonymous,
        user: user,
        space: targetSpace,
        userRoleType,
      });

      const result = await this.postRepository.save(post);

      return {
        postId: result.id,
      };
    });
  }

  /**
   * 현재 유저가 속한 스페이스의 모든 게시글 조회
   * @param userId
   * @param pageRequest
   * @returns 해당 space의 모든 게시글
   */
  async findAllPosts(userId: number, pageRequest: PostPageRequest) {
    const spaceId = +pageRequest.spaceId;

    const user = await this.userRepository.checkUserofSpace(userId, spaceId);
    if (!user) {
      throw new ForbiddenException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const spaceUser = await this.usersService.getUserSpaceRole(userId, spaceId);

    const roleType = spaceUser.spaceRole.type;

    const [postList, totalCount] =
      await this.postRepository.findAndCountBySpaceId(pageRequest, spaceId);

    const items = postList.map((post) => {
      return new PostListDto(post, userId, roleType);
    });

    return new Page<PostListDto>(totalCount, items, pageRequest);
  }

  /**
   * 게시글 상세조회 및 댓글 목록 조회
   * @param userId
   * @param postId
   * @returns
   */
  async findPostWithComment(
    postId: number,
    userId: number,
    pageRequest: PageRequest,
  ) {
    const post = await this.postRepository.findOneWithComments(postId);
    if (!post) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_POST);
    }
    console.log('post::', post);

    const user = await this.usersService.validateUser(userId);
    const spaceUser = await this.usersService.getUserSpaceRole(
      userId,
      post.space.id,
    );
    const roleType = spaceUser.spaceRole.type;

    const [comments, totalCount] =
      await this.chatRepository.findAndCountByPostId(postId, pageRequest);

    const items = comments.map((comment) => {
      return new ChatListDto(comment, userId, roleType);
    });
    return {
      post: new PostListDto(post, userId, roleType),
      comments: new Page<ChatListDto>(totalCount, items, pageRequest),
    };
  }

  /**
   * 게시글 삭제 (관리자, 작성자만)
   * @param postId
   * @param spaceId
   * @param userId
   */
  async deletPost(postId: number, spaceId: number, userId: number) {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const post = await this.postRepository.findPostAuthorAndSpaceByPostId(
      postId,
    );
    if (!post || post.space.id !== spaceId) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_POST);
    }

    const userSpaceRole =
      await this.userRepository.getSpaceRoleBySpaceIdAndUserId(userId, spaceId);

    if (
      !userSpaceRole.hasRoleInSpace(spaceId, RoleType.ADMIN) &&
      !post.isAuthor(userId)
    ) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }

    await this.postRepository.softDelete(postId);
  }
}
