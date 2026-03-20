import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovimientosSaldoDto {
  @ApiProperty({ description: 'ID del usuario', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Tipo de movimiento', example: 'recarga' })
  tipoMovimiento: string;

  @ApiProperty({ description: 'Monto del movimiento', example: 50.00 })
  monto: number;

  @ApiPropertyOptional({ description: 'ID del pedido asociado (si aplica)', example: 'uuid-pedido' })
  idPedido?: string;

  @ApiPropertyOptional({ description: 'ID del método de pago utilizado', example: 1 })
  idMetodoPago?: number;
}
