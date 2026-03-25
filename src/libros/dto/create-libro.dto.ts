import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLibroDto {
  @ApiProperty({ description: 'Título del libro', example: 'El Quijote' })
  titulo: string;

  @ApiProperty({ description: 'ID del autor', example: 1 })
  idAutor: number;

  @ApiProperty({ description: 'IDs de géneros del libro', example: [1, 2] })
  idGeneros: number[];

  @ApiProperty({ description: 'ID de la editorial', example: 1 })
  idEditorial: number;

  @ApiProperty({ description: 'Año de publicación', example: 1605 })
  anoPublicacion: number;

  @ApiProperty({ description: 'Precio del libro', example: 29.99 })
  precio: number;

  @ApiProperty({ description: 'Número ISBN', example: '978-0451524935' })
  isbn: string;

  @ApiProperty({ description: 'Idioma del libro', example: 'Español' })
  idioma: string;

  @ApiPropertyOptional({
    description: 'Descripción del libro',
    example: 'Una novela de aventuras y sátira',
  })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de portada',
    example: 'https://example.com/portada.jpg',
  })
  imagenPortada?: string;

  @ApiProperty({
    description: 'Estado del libro',
    example: 'nuevo',
    enum: ['nuevo', 'usado'],
  })
  estado: string;
}
