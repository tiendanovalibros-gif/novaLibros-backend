import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsInt } from 'class-validator';

export class RecargarSaldoDto {
  @ApiProperty({ description: 'Monto a recargar', example: 50000 })
  @IsNumber()
  @IsPositive()
  monto: number;

  @ApiProperty({ description: 'ID del metodo de pago usado', example: 1 })
  @IsInt()
  @IsPositive()
  idMetodoPago: number;
}
