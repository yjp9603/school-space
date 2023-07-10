import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import UseAuthGuards from '../auth/auth-guards/user-auth';
import { User } from './entities/user.entity';
import AuthUser from 'src/core/decorators/auth-user.decorator';

@Controller({
  path: 'users',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateUserDto) {
    const result = await this.usersService.createUser(dto);
    return res.status(201).json(result.id);
  }

  @UseAuthGuards()
  @Get('/me')
  async getUserInfo(@Res() res, @AuthUser() user: User) {
    const result = await this.usersService.getUserInfo(user.id);
    return res.status(200).send(result);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = this.usersService.update(id, updateUserDto);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
