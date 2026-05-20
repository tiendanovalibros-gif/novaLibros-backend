import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class CreateReservaDto {
  @ApiProperty({
    description: 'ID del libro a reservar',
    example: 'uuid-libro',
  })
  @IsUUID()
  idLibro: string;

  @ApiProperty({
    description: 'Cantidad de ejemplares a reservar',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  cantidad: number;
}
