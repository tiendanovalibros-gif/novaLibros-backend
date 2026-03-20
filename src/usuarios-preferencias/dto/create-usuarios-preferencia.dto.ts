import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuariosPreferenciaDto {
  @ApiProperty({ description: 'ID del usuario', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'ID de la preferencia literaria', example: 1 })
  idPreferenciaLiteraria: number;
}
