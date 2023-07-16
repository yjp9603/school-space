import { Page, PageRequest } from './../../common/page';
import { SpaceUserRepository } from './../spaces/repositories/spaces-user.repository';
import { SpaceRepository } from './../spaces/repositories/spaces.repository';
import { PostRepository } from './repositories/post.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserRepository } from '../users/repositories/user.repository';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { Post } from './entities/post.entity';
import { PostType } from './constants/constants';
import { RoleType } from '../spaces/constants/constants';
import { Connection } from 'typeorm';
import { PostPageRequest } from './dtos/post.pagination';
import { PostListDto } from './dtos/post-list.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly spaceRepository: SpaceRepository,
    private readonly spaceUserRepository: SpaceUserRepository,
    private readonly connection: Connection,
  ) {}
  async createPost(dto: CreatePostDto, userId: number) {
    await this.connection.transaction(async () => {
      // 1. 유저가 어떤 스페이스 참여중이고, 어떤 권한을 가지고 있는지
      const userSpaceRole = await this.userRepository.findSpaceRoleBySpaceId(
        userId,
        dto.spaceId,
      );
      if (!userSpaceRole || !userSpaceRole.spaceUsers) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
      }

      const spaceUser = userSpaceRole.spaceUsers.find(
        (su) => su.space.id === dto.spaceId,
      );

      // 2. 공지사항을 작성할 수 있는 어드민 유저인지 권한체크
      if (
        dto.type === PostType.NOTICE &&
        spaceUser.spaceRole.type !== RoleType.ADMIN
      ) {
        throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
      }

      // 3. 익명 유저로 작성할 수 있는 참여자인지 체크
      if (
        spaceUser.spaceRole.type !== RoleType.PARTICIPANT &&
        dto.isAnonymous === true
      ) {
        throw new ForbiddenException(HttpErrorConstants.FORBIDDEN_ANONYMOUS);
      }

      //4. Post 생성
      const post = Post.from({
        content: dto.content,
        type: dto.type,
        isAnonymous: dto.isAnonymous,
        user: userSpaceRole,
        space: spaceUser.space,
      });

      //5.저장
      await this.postRepository.save(post);

      return { postId: post.id };
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
    // 1. 해당 유저가 spaceId의 스페이스에 속해있는지 체크
    const user = await this.userRepository.isUserPartOfSpace(userId, spaceId);
    if (!user) {
      throw new ForbiddenException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    // 2. 해당 space의 모든 게시글 조회
    const [postList, totalCount] =
      await this.postRepository.findAndCountBySpaceId(pageRequest, spaceId);

    // 익명 유저인 경우, 익명 게시글은 id를 '익명'으로 변경
    // 관리자는 익명이여도 글쓴이 확인 가능
    const items = postList.map((post) => new PostListDto(post));

    return new Page<PostListDto>(totalCount, items, pageRequest);
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
