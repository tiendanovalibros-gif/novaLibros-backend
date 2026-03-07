import { PartialType } from '@nestjs/mapped-types';
import { CreateItemsReservaDto } from './create-items-reserva.dto';

export class UpdateItemsReservaDto extends PartialType(CreateItemsReservaDto) {}
