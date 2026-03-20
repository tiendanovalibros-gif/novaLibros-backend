import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
  @ApiProperty({ description: 'ID del usuario que realiza la reserva', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Hora de creación de la reserva (ISO 8601)', example: '2026-03-20T10:00:00Z' })
  horaCreacion: string;

  @ApiProperty({ description: 'Hora de expiración de la reserva (ISO 8601)', example: '2026-03-27T10:00:00Z' })
  horaExpiracion: string;

  @ApiProperty({ description: 'Estado de la reserva', example: 'activa' })
  estado: string;
}
