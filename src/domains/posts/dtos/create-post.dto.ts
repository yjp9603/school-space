import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { PostType } from '../constants/constants';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsEnum(PostType)
  type: PostType;

  @IsBoolean()
  isAnonymous: boolean;

  @IsNumber()
  spaceId: number;
}
