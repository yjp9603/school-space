import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './repositories/post.repository';
import { SpaceUserRepository } from '../spaces/repositories/spaces-user.repository';
import { SpaceRepository } from '../spaces/repositories/spaces.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      SpaceUserRepository,
      SpaceRepository,
      UserRepository,
    ]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, TypeOrmModule],
})
export class PostsModule {}
