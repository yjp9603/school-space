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

@Injectable()
export class PostsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly spaceRepository: SpaceRepository,
    private readonly spaceUserRepository: SpaceUserRepository,
  ) {}

  async createPost(dto: CreatePostDto, userId: number) {
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
    if (spaceUser.spaceRole.type !== RoleType.PARTICIPANT && dto.isAnonymous) {
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

    return { result: post.id };
  }

  findAll() {
    return `This action returns all posts`;
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
