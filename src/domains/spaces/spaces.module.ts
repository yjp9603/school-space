import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from './repositories/spaces.repository';
import { UserRepository } from '../users/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceRepository, UserRepository])],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService, TypeOrmModule],
})
export class SpacesModule {}
