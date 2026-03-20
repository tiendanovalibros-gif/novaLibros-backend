import { ApiProperty } from '@nestjs/swagger';

export class CreateCarritoDto {
  @ApiProperty({ description: 'ID del usuario propietario del carrito', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Fecha de creación del carrito (ISO 8601)', example: '2026-03-20T10:30:00Z' })
  fechaCreacion: string;

  @ApiProperty({ description: 'Fecha de última actualización (ISO 8601)', example: '2026-03-20T10:30:00Z' })
  fechaActualizacion: string;
}
