import { Controller, Post, Body, Param, Delete, Res } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import UseAuthGuards from '../auth/auth-guards/user-auth';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @UseAuthGuards()
  async create(
    @Res() res: Response,
    @Body() createChatDto: CreateChatDto,
    @AuthUser() user: User,
  ) {
    const result = await this.chatsService.create(createChatDto, user.id);
    return res.status(201).json(result);
  }

  @Delete(':chatId')
  @UseAuthGuards()
  async deleteChat(
    @Res() res: Response,
    @Param('chatId') chatId: number,
    @AuthUser() user: User,
  ) {
    const result = this.chatsService.deleteChat(+chatId, user.id);
    return res.status(200).json(result);
  }
}
