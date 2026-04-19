import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
  @ApiProperty({
    description: 'ID del libro a reservar',
    example: 'uuid-libro',
  })
  idLibro: string;

  @ApiProperty({
    description: 'Cantidad de ejemplares a reservar',
    example: 1,
    minimum: 1,
  })
  cantidad: number;
}
