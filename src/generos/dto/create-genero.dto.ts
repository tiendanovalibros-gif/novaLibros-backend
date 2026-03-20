import { ApiProperty } from '@nestjs/swagger';

export class CreateGeneroDto {
  @ApiProperty({ description: 'Nombre del género literario', example: 'Ficción científica' })
  nombre: string;
}
