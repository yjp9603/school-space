import { Test, TestingModule } from '@nestjs/testing';
import { SpaceRolesController } from './space-roles.controller';
import { SpaceRolesService } from './space-roles.service';

describe('SpaceRolesController', () => {
  let controller: SpaceRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceRolesController],
      providers: [SpaceRolesService],
    }).compile();

    controller = module.get<SpaceRolesController>(SpaceRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
