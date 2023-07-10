import { User } from 'src/domains/users/entities/user.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { UserInfoResponseDto } from './dto/user-info-response.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  /**
   * 유저 회원가입
   * @param dto CreateUserDto
   * @returns User
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const existEmail = await this.userRepository.existByEmail(dto.email);
    if (existEmail) {
      throw new ConflictException(HttpErrorConstants.EXIST_EMAIL);
    }

    const user = await User.from(dto);

    return await this.userRepository.save(user);
  }

  /**
   * 내 정보 조회
   * @param userIdx 유저 인덱스
   * @returns 패스워드, 삭제일 제외한 유저 정보
   */
  async getUserInfo(userId: number) {
    const userInfo = await this.userRepository.findByUserId(userId);

    if (!userInfo) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    return new UserInfoResponseDto(userInfo);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);
    await user.update(dto);
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
