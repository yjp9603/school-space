import { IsNumber } from 'class-validator';
import { PageRequest } from 'src/common/page';

export class PostPageRequest extends PageRequest {
  @IsNumber()
  spaceId: number;
}
