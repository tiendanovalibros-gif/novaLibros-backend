import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallesCarritoDto } from './create-detalles-carrito.dto';

export class UpdateDetallesCarritoDto extends PartialType(CreateDetallesCarritoDto) {}
