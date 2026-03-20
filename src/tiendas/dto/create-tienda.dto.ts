import { ApiProperty } from '@nestjs/swagger';

export class CreateTiendaDto {
  @ApiProperty({ description: 'Nombre de la tienda', example: 'Tienda Centro' })
  nombre: string;

  @ApiProperty({ description: 'Dirección de la tienda', example: 'Calle Principal 100, Bogotá' })
  direccion: string;

  @ApiProperty({ description: 'Latitud de ubicación geográfica', example: 4.7110 })
  latitud: number;

  @ApiProperty({ description: 'Longitud de ubicación geográfica', example: -74.0721 })
  longitud: number;
}
