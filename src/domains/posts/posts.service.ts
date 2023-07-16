import { Page } from './../../common/page';
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
import { Name } from '../users/entities/name.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly spaceRepository: SpaceRepository,
    private readonly connection: Connection,
  ) {}
  /**
   * 참여중인 스페이스의 게시글 작성
   * @param dto
   * @param userId
   * return postId
   */
  async createPost(dto: CreatePostDto, userId: number) {
    await this.connection.transaction(async () => {
      const currentUser = await this.userRepository.findByUserId(userId);
      if (!currentUser) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
      }

      const targetSpace = await this.spaceRepository.findSpaceRoleBySpaceId(
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
        user: currentUser,
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
    // 1. 해당 유저가 요청한 spaceId의 스페이스에 속해있는지 체크
    const user = await this.userRepository.isUserPartOfSpace(userId, spaceId);
    if (!user) {
      throw new ForbiddenException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    // 유저의 권한 확인 (관리자 or 참가자)
    const userSpaceRole = await this.userRepository.findSpaceRoleBySpaceId(
      userId,
      spaceId,
    );
    if (!userSpaceRole) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }

    const spaceUser = userSpaceRole.spaceUsers.find(
      (su) => su.space.id === spaceId,
    );

    // 2. 해당 space의 모든 게시글 조회
    const [postList, totalCount] =
      await this.postRepository.findAndCountBySpaceId(pageRequest, spaceId);

    // 익명으로 작성한 경우, name을 '익명'으로 변경
    // 관리자와 본인은 정상 조회.
    const items = postList.map((post) => {
      if (
        post.isAnonymous && //익명인데
        userId !== post.author.id && // 본인이 아니고
        spaceUser.spaceRole.type !== RoleType.ADMIN //관리자가 아니면
      ) {
        post.author.name.firstName = '익명';
        post.author.name.lastName = '참여자';
      }
      return new PostListDto(post);
    });

    return new Page<PostListDto>(totalCount, items, pageRequest);
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  /**
   * 게시글 삭제 (관리자, 작성자만)
   * @param id
   * @returns
   */
  async deletPost(postId: number, spaceId: number, userId: number) {
    // 1. 게시글 조회
    // 2. 관리자 or 작성자 인지 체크
    // 3. soft delete
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author', 'space'],
    });
    if (!post && post.space.id !== spaceId) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_POST);
    }
    console.log('post::', post);

    console.log('post.space.id::', post.space.id);
    const role = await this.userRepository.findSpaceRoleBySpaceId(
      userId,
      post.space.id,
    );
    console.log('role::', role);
    if (
      role.spaceUsers[0].spaceRole.type !== RoleType.ADMIN &&
      post.author.id !== userId
    ) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }

    await this.postRepository.softDelete(postId);
  }
}
