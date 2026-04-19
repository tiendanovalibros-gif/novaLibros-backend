import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchLibrosDto {
  @ApiPropertyOptional({
    description:
      'Texto libre para buscar por titulo, descripcion, autor, editorial o genero',
    example: 'realismo magico',
  })
  q?: string;

  @ApiPropertyOptional({
    description: 'ID del autor (filtro opcional)',
    example: 1,
  })
  idAutor?: string;

  @ApiPropertyOptional({
    description: 'IDs de generos separados por coma (filtro opcional)',
    example: '1,2,3',
  })
  generos?: string;

  @ApiPropertyOptional({
    description: 'Ano minimo de publicacion (filtro opcional)',
    example: 1990,
  })
  anoMin?: string;

  @ApiPropertyOptional({
    description: 'Ano maximo de publicacion (filtro opcional)',
    example: 2024,
  })
  anoMax?: string;
}
