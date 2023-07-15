import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import UseAuthGuards from '../auth/auth-guards/user-auth';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseAuthGuards()
  async createPost(
    @Res() res: Response,
    @Body() dto: CreatePostDto,
    @AuthUser() user: User,
  ) {
    const result = await this.postsService.createPost(dto, user.id);
    return res.status(201).json(result);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
