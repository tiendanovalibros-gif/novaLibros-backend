import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrosBusquedaDto {
  @ApiProperty({ description: 'ID del usuario que realiza la búsqueda', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Criterio de búsqueda', example: 'ficción científica' })
  criterio: string;
}
