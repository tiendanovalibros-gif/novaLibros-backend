import { ApiProperty } from '@nestjs/swagger';

export class CreateInventarioDto {
  @ApiProperty({ description: 'ID del libro en inventario', example: 'uuid-libro' })
  idLibro: string;

  @ApiProperty({ description: 'ID de la tienda', example: 1 })
  idTienda: number;

  @ApiProperty({ description: 'Cantidad de libros disponibles', example: 50 })
  cantidadDisponible: number;

  @ApiProperty({ description: 'Cantidad de libros bloqueados/reservados', example: 5 })
  cantidadBloqueada: number;

  @ApiProperty({ description: 'Fecha de última actualización (ISO 8601)', example: '2026-03-20T10:30:00Z' })
  fechaActualizacion: string;
}
