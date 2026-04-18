import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DIRECCION_COLOMBIA_MESSAGE,
  DIRECCION_COLOMBIA_REGEX,
} from './direccion-format.constants';

export class ValidateTiendaDireccionDto {
  @ApiProperty({
    description: 'Dirección que se desea validar dentro de una ciudad',
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
}
