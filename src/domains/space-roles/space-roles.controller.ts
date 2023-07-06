import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpaceRolesService } from './space-roles.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';

@Controller('space-roles')
export class SpaceRolesController {
  constructor(private readonly spaceRolesService: SpaceRolesService) {}

  @Post()
  create(@Body() createSpaceRoleDto: CreateSpaceRoleDto) {
    return this.spaceRolesService.create(createSpaceRoleDto);
  }

  @Get()
  findAll() {
    return this.spaceRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceRolesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpaceRoleDto: UpdateSpaceRoleDto,
  ) {
    return this.spaceRolesService.update(+id, updateSpaceRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceRolesService.remove(+id);
  }
}
