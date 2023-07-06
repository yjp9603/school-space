import { Injectable } from '@nestjs/common';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';

@Injectable()
export class SpaceRolesService {
  create(createSpaceRoleDto: CreateSpaceRoleDto) {
    return 'This action adds a new spaceRole';
  }

  findAll() {
    return `This action returns all spaceRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spaceRole`;
  }

  update(id: number, updateSpaceRoleDto: UpdateSpaceRoleDto) {
    return `This action updates a #${id} spaceRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} spaceRole`;
  }
}
