import { IsNotEmpty, IsString } from 'class-validator';

export class JoinSpaceDto {
  @IsString()
  @IsNotEmpty()
  joinCode: string;
}
