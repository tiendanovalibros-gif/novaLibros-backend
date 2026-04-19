import { ApiProperty } from '@nestjs/swagger';

export class AddItemCarritoDto {
  @ApiProperty({
    description: 'ID del libro a agregar al carrito',
    example: 'uuid-libro',
  })
  idLibro: string;

  @ApiProperty({
    description: 'Cantidad de libros a agregar',
    example: 1,
    minimum: 1,
  })
  cantidad: number;
}
