import { Module } from '@nestjs/common';
import { SpaceRolesService } from './space-roles.service';
import { SpaceRolesController } from './space-roles.controller';

@Module({
  controllers: [SpaceRolesController],
  providers: [SpaceRolesService],
})
export class SpaceRolesModule {}
