import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from './repositories/chat.repository';
import { PostRepository } from '../posts/repositories/post.repository';
import { UserRepository } from '../users/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository, PostRepository, UserRepository]),
    UsersModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, TypeOrmModule],
})
export class ChatsModule {}
