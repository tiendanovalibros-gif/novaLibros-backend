import { ApiProperty } from '@nestjs/swagger';

export class CreateItemsPedidoDto {
  @ApiProperty({ description: 'ID del pedido', example: 'uuid-pedido' })
  idPedido: string;

  @ApiProperty({ description: 'ID del libro en el pedido', example: 'uuid-libro' })
  idLibro: string;

  @ApiProperty({ description: 'Cantidad de libros pedidos', example: 2 })
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario del libro al momento del pedido', example: 29.99 })
  precioUnitario: number;
}
