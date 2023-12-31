import { HttpErrorConstants } from 'src/common/http/http-error-objects';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/domains/users/repositories/user.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_REFRESH_TOKEN); //리프레시 토큰 만료. 재로그인 필요
    }
    return user;
  }
}
