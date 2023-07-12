import { IsEnum } from 'class-validator';
import { RoleType } from '../constants/constants';

export class UpdateSpaceRoleTypeDto {
  @IsEnum(RoleType)
  type: RoleType;
}
