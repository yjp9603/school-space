import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSpaceDto } from './create-space.dto';

export class UpdateSpaceDto extends PartialType(
  OmitType(CreateSpaceDto, ['roles'] as const),
) {}
