import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class AddItemCarritoDto {
  @ApiProperty({
    description: 'ID del libro a agregar al carrito',
    example: 'uuid-libro',
  })
  @IsUUID()
  idLibro: string;

  @ApiProperty({
    description: 'Cantidad de libros a agregar',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  cantidad: number;
}
