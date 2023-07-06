import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaceRoleDto } from './create-space-role.dto';

export class UpdateSpaceRoleDto extends PartialType(CreateSpaceRoleDto) {}
