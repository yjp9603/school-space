import { User } from 'src/domains/users/entities/user.entity';
import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  /**
   * 유저 회원가입
   * @param dto CreateUserDto
   * @returns User
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const existEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existEmail) {
      throw new ConflictException(HttpErrorConstants.EXIST_EMAIL);
    }

    const user = await User.from(dto);

    return await this.userRepository.save(user);
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
