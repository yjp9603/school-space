import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtRefreshGuard } from './auth-guards/refresh-guard';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Res() res, @Body() dto: LoginUserDto) {
    const result = await this.authService.login(dto);
    return res.status(201).send(result);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/newAccessToken')
  async getNewAccessToken(@Res() res, @Body() dto: RefreshTokenDto) {
    const result = await this.authService.getNewAccessToken(dto.refreshToken);
    return res.status(201).send(result);
  }
}
