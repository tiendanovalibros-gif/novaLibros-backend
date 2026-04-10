import { ApiProperty } from '@nestjs/swagger';

export class UpdateCantidadLibroDto {
  @ApiProperty({
    description: 'Nueva cantidad disponible del libro en la tienda',
    example: 25,
  })
  cantidadDisponible: number;
}
