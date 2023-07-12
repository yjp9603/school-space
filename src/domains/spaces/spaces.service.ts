import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { SpaceRepository } from './repositories/spaces.repository';
import { Space } from './entities/space.entity';
import { User } from '../users/entities/user.entity';
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
      adminCode: dto.adminCode,
      accessCode: dto.accessCode,
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
   */

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
    console.log(space);

    if (!space) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SPACE);
    }

    space.spaceUsers.map((spaceUser) => {
      if (!spaceUser.isOwner) {
        throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
      }
    });

    await this.spaceRepository.softDelete(spaceId);
  }
}
