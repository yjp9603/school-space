import { isDevelopMode } from './utils/env-utils';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from 'src/domains/chats/chats.module';
import { PostsModule } from 'src/domains/posts/posts.module';
import { SpaceRolesModule } from 'src/domains/space-roles/space-roles.module';
import { SpacesModule } from 'src/domains/spaces/spaces.module';
import { UsersModule } from 'src/domains/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { AuthModule } from './domains/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isDevelopMode ? './env/.dev.env' : './env/.prod.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SpacesModule,
    SpaceRolesModule,
    PostsModule,
    ChatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (isDevelopMode) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
  }
}
