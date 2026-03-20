import { ApiProperty } from '@nestjs/swagger';

export class CreatePreferenciasLiterariaDto {
  @ApiProperty({ description: 'Nombre de la preferencia literaria', example: 'Ficción científica' })
  nombre: string;
}
