import { ApiProperty } from '@nestjs/swagger';

export class BloquearLibrosDto {
  @ApiProperty({ description: 'Cantidad de libros a bloquear', example: 3 })
  cantidadABloquear: number;
}
