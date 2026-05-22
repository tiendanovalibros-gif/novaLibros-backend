import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateTiendaUbicacionDto {
  @ApiProperty({ example: 4.711, description: 'Latitud (WGS84)' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitud debe ser numérica' })
  @Min(-4.5, { message: 'Latitud fuera del rango válido para Colombia' })
  @Max(13.5, { message: 'Latitud fuera del rango válido para Colombia' })
  latitud: number;

  @ApiProperty({ example: -74.0721, description: 'Longitud (WGS84)' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La longitud debe ser numérica' })
  @Min(-82, { message: 'Longitud fuera del rango válido para Colombia' })
  @Max(-66, { message: 'Longitud fuera del rango válido para Colombia' })
  longitud: number;
}
