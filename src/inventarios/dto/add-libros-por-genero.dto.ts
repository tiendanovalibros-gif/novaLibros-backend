import { ApiProperty } from '@nestjs/swagger';

export class AddLibrosPorGeneroDto {
  @ApiProperty({
    description: 'Cantidad disponible inicial para cada libro del genero',
    example: 10,
  })
  cantidadDisponible: number;

  @ApiProperty({
    description: 'Cantidad bloqueada inicial para cada libro del genero',
    example: 0,
    required: false,
    default: 0,
  })
  cantidadBloqueada?: number;
}
