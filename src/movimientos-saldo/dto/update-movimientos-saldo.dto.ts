import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientosSaldoDto } from './create-movimientos-saldo.dto';

export class UpdateMovimientosSaldoDto extends PartialType(CreateMovimientosSaldoDto) {}
