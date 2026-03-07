import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoreDto } from './create-autore.dto';

export class UpdateAutoreDto extends PartialType(CreateAutoreDto) {}
