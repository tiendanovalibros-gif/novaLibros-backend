import { ApiProperty } from '@nestjs/swagger';

export class Tienda {
  @ApiProperty({
    description: 'Identificador único de la tienda',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre comercial de la tienda',
    example: 'Tienda Centro',
  })
  nombre: string;

  @ApiProperty({
    description: 'Dirección física de la tienda',
    example: 'Calle Principal 100, Bogotá',
  })
  direccion: string;

  @ApiProperty({
    description:
      'Dirección normalizada por el proveedor de geocodificación para búsqueda y consistencia',
    example: 'Calle 23 # 13-45, Centenario, Pereira, Risaralda, Colombia',
  })
  direccionNormalizada: string;

  @ApiProperty({
    description: 'Ciudad asociada a la tienda',
    example: 'Pereira',
    nullable: true,
  })
  ciudad: string | null;

  @ApiProperty({
    description: 'Latitud de la ubicación de la tienda',
    example: 4.711,
  })
  latitud: number;

  @ApiProperty({
    description: 'Longitud de la ubicación de la tienda',
    example: -74.0721,
  })
  longitud: number;
}
