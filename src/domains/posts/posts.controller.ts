import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import UseAuthGuards from '../auth/auth-guards/user-auth';
import { PostPageRequest } from './dtos/post.pagination';

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
  @UseAuthGuards()
  async findAllPosts(
    @Res() res: Response,
    @Query() pageRequest: PostPageRequest,
    @AuthUser() user: User,
  ) {
    const result = await this.postsService.findAllPosts(user.id, pageRequest);
    return res.status(200).json(result);
  }

  @Delete('/:postId')
  @UseAuthGuards()
  async deletPost(
    @Res() res: Response,
    @Param('postId') postId: number,
    @Query('spaceId') spaceId: number,
    @AuthUser() user: User,
  ) {
    const result = await this.postsService.deletPost(
      +postId,
      +spaceId,
      user.id,
    );
    return res.status(200).json(result);
  }
}
