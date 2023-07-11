import { IsNotEmpty } from 'class-validator';
import { RoleType } from '../constants/constants';

export class CreateSpaceDto {
  spaceName: string;

  logo: string;

  userId: number;

  adminCode: string;

  accessCode: string;

  roleName: string;

  type: RoleType;
}
