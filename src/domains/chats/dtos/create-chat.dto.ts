import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  isAnonymous: boolean;

  @IsNotEmpty()
  postId: number;

  //   @IsNotEmpty()
  //   spaceId: number;

  @IsOptional()
  parentId?: number;
}
