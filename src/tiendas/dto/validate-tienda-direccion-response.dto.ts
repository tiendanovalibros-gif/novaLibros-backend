import { ApiProperty } from '@nestjs/swagger';

export class ValidateTiendaDireccionResponseDto {
  @ApiProperty({
    description:
      'Indica si la dirección encontrada pertenece a la ciudad seleccionada',
    example: true,
  })
  coincideCiudad: boolean;

  @ApiProperty({
    description: 'Latitud calculada por el servicio de geocodificación',
    example: 4.711,
  })
  latitud: number;

  @ApiProperty({
    description: 'Longitud calculada por el servicio de geocodificación',
    example: -74.0721,
  })
  longitud: number;

  @ApiProperty({
    description: 'Ciudad detectada por el servicio de geocodificación',
    example: 'Bogotá',
  })
  ciudadDetectada: string;

  @ApiProperty({
    description:
      'Dirección normalizada devuelta por el proveedor de geocodificación',
    example: 'Calle 100, La Floresta, Localidad Suba, Bogotá, Colombia',
  })
  direccionNormalizada: string;

  @ApiProperty({
    description: 'Proveedor utilizado para geocodificación',
    example: 'nominatim',
  })
  proveedor: string;
}
