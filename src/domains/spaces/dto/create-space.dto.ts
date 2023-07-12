import { IsNotEmpty } from 'class-validator';
import { RoleType } from '../constants/constants';

export class CreateSpaceDto {
  spaceName: string;

  logo: string;

  userId: number;

  @IsNotEmpty()
  roles: {
    roleName: string;
    type: RoleType;
  }[];
}
