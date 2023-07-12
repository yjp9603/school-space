import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { Page } from './page';

export class PageResponseDto<T> {
  @IsOptional()
  @Type(() => Page)
  @ValidateNested()
  readonly result: Page<T>;
}
