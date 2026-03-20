import { ApiProperty } from '@nestjs/swagger';

export class CreateFacturaDto {
  @ApiProperty({ description: 'ID del pedido asociado', example: 'uuid-pedido' })
  idPedido: string;

  @ApiProperty({ description: 'ID del usuario', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Monto subtotal (antes de impuestos)', example: 99.99 })
  montoSubtotal: number;

  @ApiProperty({ description: 'Monto del IVA', example: 19.99 })
  iva: number;

  @ApiProperty({ description: 'Monto total (incluyendo impuestos)', example: 119.98 })
  montoTotal: number;
}
