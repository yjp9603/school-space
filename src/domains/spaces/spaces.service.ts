import { SpaceUserRepository } from './repositories/spaces-user.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceRepository } from './repositories/spaces.repository';
import { Space } from './entities/space.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { SpaceUser } from './entities/space-user.entity';
import { CreateSpaceResponseDto } from './dto/create-space-response.dto';
import { RoleType } from './constants/constants';
import { Page, PageRequest } from 'src/common/page';
import { SpaceListDto } from './dto/space-list.dto';

@Injectable()
export class SpacesService {
  constructor(
    private readonly spaceRepository: SpaceRepository,
    private readonly userRepository: UserRepository,
    private readonly spaceUserRepository: SpaceUserRepository,
  ) {}

  /**
   * 스페이스 생성
   * @param dto CreateSpaceDto
   * @param requestUserId 생성 유저 아이디
   * @returns 생성한 스페이스 인덱스
   */
  async createSpace(dto: CreateSpaceDto, requestUserId: number) {
    const user = await this.userRepository.findByUserId(requestUserId);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    if (!dto.roles || !dto.roles.find((role) => role.type === RoleType.ADMIN)) {
      throw new UnprocessableEntityException(
        HttpErrorConstants.UNPROCESSABLE_ENTITY,
      );
    }

    const space = Space.from({
      spaceName: dto.spaceName,
      logo: dto.logo,
      user,
      roles: dto.roles,
    });

    await this.spaceRepository.save(space);

    const result = new CreateSpaceResponseDto(space);
    return result;
  }

  /**
   * 유저의 공간 목록 조회
   * @param userId
   * @param pageRequest
   * @returns
   */
  async findAllSpaceList(userId: number, pageRequest: PageRequest) {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const [spaceList, totalCount] =
      await this.spaceRepository.findAndCountByUserId(userId, pageRequest);

    const items = spaceList.map((space) => new SpaceListDto(space));
    return new Page<SpaceListDto>(totalCount, items, pageRequest);
  }

  /**
   * 공간 구성원의 권한 변경 (또는 삭제)
   * @param id
   * @returns
   */

  /**
   * 소유자 임명
   */

  /**
   * 공간 참여
   * @param joinCode
   * @param userId
   * @returns
   */
  async joinSpace(joinCode: string, userId: number) {
    // 1. 유저 조회
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    // 2. 입력한 참여 코드로 공간 조회
    const space = await this.spaceRepository.findSpaceByJoinCode(joinCode);
    if (!space) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SPACE);
    }

    // 3. 이미 참여중인 공간인지 확인
    const existingSpaceUser = space.spaceUsers.find(
      (spaceUser) => spaceUser.user.id === userId,
    );
    if (existingSpaceUser) {
      throw new ConflictException(HttpErrorConstants.ALREADY_JOINED_SPACE);
    }

    // 4. 참여 코드에 맞는 권한을 부여 (관리자 or 참여자)
    const roleType =
      joinCode === space.adminCode ? RoleType.ADMIN : RoleType.PARTICIPANT;

    const spaceRole = space.spaceRoles.find((role) => role.type === roleType);
    if (!spaceRole) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_ROLE);
    }

    // 5. 공간의 구성원으로 추가
    const newSpaceUser = SpaceUser.from(user, spaceRole);
    newSpaceUser.setSpace(space);
    space.addSpaceUser(newSpaceUser);

    await this.spaceUserRepository.save(newSpaceUser);

    return new CreateSpaceResponseDto(space);
  }

  /**
   * 공간 삭제
   * @param spaceId
   * @param requestUserId
   */
  async deleteSpace(spaceId: number, requestUserId: number) {
    const space = await this.spaceRepository.findSpaceUserBySpaceIdAndUserId(
      spaceId,
      requestUserId,
    );

    if (!space) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SPACE);
    }

    if (!space.spaceUsers.some((spaceUser) => spaceUser.isOwner)) {
      throw new NotFoundException(HttpErrorConstants.FORBIDDEN);
    }

    await this.spaceRepository.softDelete(spaceId);
  }
}
