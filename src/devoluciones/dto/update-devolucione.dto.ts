import { PartialType } from '@nestjs/mapped-types';
import { CreateDevolucioneDto } from './create-devolucione.dto';

export class UpdateDevolucioneDto extends PartialType(CreateDevolucioneDto) {}
