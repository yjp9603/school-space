import { User } from 'src/domains/users/entities/user.entity';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserInfoResponseDto } from './dtos/user-info-response.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { Connection } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private readonly connection: Connection,
  ) {}
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

    await this.userRepository.save(user);

    return user;
  }

  /**
   * 유저 정보 조회
   * @param userId, requestUser
   * @returns 패스워드, 삭제일 제외한 유저 정보
   */
  async findUser(id: number, requestUser: User): Promise<UserInfoResponseDto> {
    const user = await this.userRepository.findByUserId(id);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    return new UserInfoResponseDto(user, requestUser);
  }

  /**
   * 유저 정보 수정
   * @param id 유저 id
   * @param dto UpdateUserDto
   * @returns 유저 id
   */
  async update(
    id: number,
    requestUser: User,
    dto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findByUserId(id);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    if (!requestUser.equals(user)) {
      throw new ForbiddenException(HttpErrorConstants.FORBIDDEN);
    }

    user.update(dto);
    await this.userRepository.save(user);
    return user;
  }

  /**
   * 비밀번호 변경
   * @param userId
   * @param dto UpdatePasswordDto
   */
  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    await user.validatePassword(dto.currentPassword, user.password);
    const newPassword = await user.hashPassword(dto.newPassword);
    await this.userRepository.updatePasswordByUserId(user.id, newPassword);
  }
}
