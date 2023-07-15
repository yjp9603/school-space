import { PostType } from '../constants/constants';

export class CreatePostDto {
  content: string;
  type: PostType;
  isAnonymous: boolean;
  spaceId: number;
}
