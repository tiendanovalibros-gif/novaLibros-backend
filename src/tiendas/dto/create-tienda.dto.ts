import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  DIRECCION_COLOMBIA_MESSAGE,
  DIRECCION_COLOMBIA_REGEX,
} from './direccion-format.constants';

export class CreateTiendaDto {
  @ApiProperty({ description: 'Nombre de la tienda', example: 'Tienda Centro' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(120, { message: 'El nombre no puede superar los 120 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Dirección de la tienda',
    example: 'Calle 100 # 7-45',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  @MaxLength(200, {
    message: 'La dirección no puede superar los 200 caracteres',
  })
  @Matches(DIRECCION_COLOMBIA_REGEX, {
    message: DIRECCION_COLOMBIA_MESSAGE,
  })
  direccion: string;

  @ApiProperty({
    description: 'Ciudad seleccionada en el formulario',
    example: 'Bogotá',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'La ciudad debe ser un texto' })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La ciudad no puede superar los 100 caracteres' })
  ciudad: string;

  @ApiProperty({
    required: false,
    description: 'Latitud opcional (ajuste manual desde mapa)',
    example: 4.711,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitud debe ser numérica' })
  @Min(-4.5)
  @Max(13.5)
  latitud?: number;

  @ApiProperty({
    required: false,
    description: 'Longitud opcional (ajuste manual desde mapa)',
    example: -74.0721,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La longitud debe ser numérica' })
  @Min(-82)
  @Max(-66)
  longitud?: number;
}
