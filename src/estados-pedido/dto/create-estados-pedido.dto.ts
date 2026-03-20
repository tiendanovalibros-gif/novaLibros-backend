import { ApiProperty } from '@nestjs/swagger';

export class CreateEstadosPedidoDto {
  @ApiProperty({ description: 'ID del pedido', example: 'uuid-pedido' })
  idPedido: string;

  @ApiProperty({ description: 'Estado del pedido', example: 'enviado' })
  estado: string;

  @ApiProperty({ description: 'Fecha del cambio de estado (ISO 8601)', example: '2026-03-20T15:45:00Z' })
  fechaCambio: string;
}
