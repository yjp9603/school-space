import { IsNotEmpty } from 'class-validator';
import { RoleType } from '../constants/constants';

export class CreateSpaceDto {
  spaceName: string;

  logo: string;

  @IsNotEmpty({
    message: 'sqlite에서 enum 타입을 지원하지 않아 DTO에서 validation',
  })
  roles: {
    roleName: string;
    type: RoleType;
  }[];
}
