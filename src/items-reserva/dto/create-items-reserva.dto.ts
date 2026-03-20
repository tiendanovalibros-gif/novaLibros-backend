import { ApiProperty } from '@nestjs/swagger';

export class CreateItemsReservaDto {
  @ApiProperty({ description: 'ID de la reserva', example: 'uuid-reserva' })
  idReserva: string;

  @ApiProperty({ description: 'ID del libro reservado', example: 'uuid-libro' })
  idLibro: string;

  @ApiProperty({ description: 'Cantidad de libros a reservar', example: 1 })
  cantidad: number;
}
