import { Space } from '../entities/space.entity';

export class CreateSpaceResponseDto {
  id: number;
  constructor(space: Space) {
    this.id = space.id;
  }
}
