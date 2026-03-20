import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePedidoDto {
  @ApiProperty({ description: 'ID del usuario que realiza el pedido', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Número único de orden', example: 'ORD-20260320-001' })
  numeroOrden: string;

  @ApiProperty({ description: 'Fecha del pedido (ISO 8601)', example: '2026-03-20T10:00:00Z' })
  fechaOrden: string;

  @ApiProperty({ description: 'Monto total del pedido', example: 149.99 })
  montoTotal: number;

  @ApiProperty({ description: 'Método de entrega', example: 'domicilio' })
  metodoEntrega: string;

  @ApiPropertyOptional({ description: 'ID de la tienda para retiro en tienda', example: 1 })
  idTienda?: number;

  @ApiPropertyOptional({ description: 'Dirección de entrega', example: 'Calle 123 #456, Apartamento 789' })
  direccionEntrega?: string;
}
