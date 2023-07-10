import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post()
  // async login(@Res() res, @Body() dto: LoginUserDto) {
  //   const result = await this.authService.login(dto);
  //   return res.status(201).send(result);
  // }
}
