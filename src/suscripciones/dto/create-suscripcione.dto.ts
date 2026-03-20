import { ApiProperty } from '@nestjs/swagger';

export class CreateSuscripcioneDto {
  @ApiProperty({ description: 'ID del usuario que se suscribe', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Indica si la suscripción está activa', example: true })
  activa: boolean;
}
