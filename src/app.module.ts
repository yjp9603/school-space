import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from 'src/domains/chats/chats.module';
import { Chat } from 'src/domains/chats/entities/chat.entity';
import { Post } from 'src/domains/posts/entities/post.entity';
import { PostsModule } from 'src/domains/posts/posts.module';
import { SpaceRole } from 'src/domains/space-roles/entities/space-role.entity';
import { SpaceRolesModule } from 'src/domains/space-roles/space-roles.module';
import { Space } from 'src/domains/spaces/entities/space.entity';
import { SpacesModule } from 'src/domains/spaces/spaces.module';
import { User } from 'src/domains/users/entities/user.entity';
import { UsersModule } from 'src/domains/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'classum_local.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // autoLoadEntities: true,
      logging: true,
      // dropSchema: false,
    }),
    UsersModule,
    SpacesModule,
    SpaceRolesModule,
    PostsModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
