import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from './repositories/spaces.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { SpaceUserRepository } from './repositories/spaces-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceRepository,
      UserRepository,
      SpaceUserRepository,
    ]),
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService, TypeOrmModule],
})
export class SpacesModule {}
