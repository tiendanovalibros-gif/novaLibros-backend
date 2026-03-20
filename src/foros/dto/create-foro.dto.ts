import { ApiProperty } from '@nestjs/swagger';

export class CreateForoDto {
  @ApiProperty({ description: 'Título del foro', example: 'Recomendaciones de libros de ciencia ficción' })
  titulo: string;

  @ApiProperty({ description: 'Fecha de creación del foro (ISO 8601)', example: '2026-03-20T10:00:00Z' })
  fechaCreacion: string;
}
