import { Space } from '../entities/space.entity';

export class CreateSpaceResponseDto {
  id: number;
  spaceName: string;
  logo: string;

  constructor(space: Space) {
    this.id = space.id;
    this.spaceName = space.spaceName;
    this.logo = space.logo;
  }
}
