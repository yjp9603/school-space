import { Space } from '../entities/space.entity';

export class SpaceListDto {
  id: number;
  spaceName: string;
  logo: string;
  adminCode: string;
  accessCode: string;

  constructor(space: Space) {
    this.id = space.id;
    this.spaceName = space.spaceName;
    this.logo = space.logo;
    this.adminCode = space.adminCode;
    this.accessCode = space.accessCode;
  }
}
