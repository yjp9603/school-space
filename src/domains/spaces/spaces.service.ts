import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { SpaceRepository } from './repositories/spaces.repository';
import { Space } from './entities/space.entity';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { SpaceUser } from './entities/space-user.entity';
import { CreateSpaceResponseDto } from './dto/create-space-response.dto';

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

  findAll() {
    return `This action returns all spaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} space`;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
