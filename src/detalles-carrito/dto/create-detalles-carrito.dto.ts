import { ApiProperty } from '@nestjs/swagger';

export class CreateDetallesCarritoDto {
  @ApiProperty({ description: 'ID del carrito', example: 1 })
  idCarrito: number;

  @ApiProperty({ description: 'ID del libro', example: 'uuid-libro' })
  idLibro: string;

  @ApiProperty({ description: 'Cantidad de libros', example: 2 })
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario del libro', example: 29.99 })
  precioUnitario: number;
}
