import { Test, TestingModule } from '@nestjs/testing';
import { SpaceRolesService } from './space-roles.service';

describe('SpaceRolesService', () => {
  let service: SpaceRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceRolesService],
    }).compile();

    service = module.get<SpaceRolesService>(SpaceRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
