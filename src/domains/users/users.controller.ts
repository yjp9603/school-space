import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { AuthGuard } from '@nestjs/passport';
import UseAuthGuards from '../auth/auth-guards/user-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateUserDto) {
    const result = await this.usersService.createUser(dto);
    return res.status(201).json(result.id);
  }

  @UseAuthGuards()
  @Get('/:id')
  async findUser(@Res() res, @Param('id') id: number, @AuthUser() user: User) {
    const result = await this.usersService.findUser(id, user);
    return res.status(200).json(result);
  }

  @UseAuthGuards()
  @Patch('/:id')
  async updateUser(
    @Res() res,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: User,
  ) {
    const result = await this.usersService.update(id, user, updateUserDto);
    return res.status(200).json(result.id);
  }

  @UseAuthGuards()
  @Patch('/password')
  async updatePassword(
    @Res() res,
    @Body() dto: UpdatePasswordDto,
    @AuthUser() user: User,
  ) {
    const result = await this.usersService.updatePassword(user.id, dto);
    return res.status(200).json(result);
  }
}
