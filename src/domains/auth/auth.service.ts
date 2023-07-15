import { UserRepository } from './../users/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * 로그인
   * @param loginUserDto
   * @returns accessToken, refreshToken, id
   */
  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }

    await user.validatePassword(dto.password, user.password);

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    // todo: 암호화해서 리프레시 토큰 저장
    await this.userRepository.update(user.id, { refreshToken: refreshToken });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      id: user.id,
    };
  }

  /**
   * 리프레시 토큰으로 액세스 토큰 재생성
   * @param refreshToken
   * @returns 새로운 액세스 토큰
   */
  async getNewAccessToken(refreshToken: string) {
    // 1. DB의 리프레시 토큰과 일치 여부 확인
    const user = await this.userRepository.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      throw new UnauthorizedException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    // 2. 리프레시 토큰 만료기간 검증
    try {
      this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_REFRESH_TOKEN);
    }

    // 3. 액세스토큰 재생성
    const accessToken = await this.generateAccessToken(user.id);

    return {
      accessToken: accessToken,
    };
  }

  async generateAccessToken(userId: number): Promise<string> {
    const payload = { userId: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const payload = { userId: userId };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30 days',
    });
  }
}
