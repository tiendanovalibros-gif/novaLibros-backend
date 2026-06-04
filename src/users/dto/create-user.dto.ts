import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Documento de identidad', example: '1234567890' })
  @IsString()
  @MinLength(1)
  dni: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  @MinLength(1)
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsString()
  @MinLength(1)
  apellido: string;

  @ApiProperty({
    description: 'Fecha de nacimiento (ISO 8601)',
    example: '1995-06-15',
  })
  @IsDateString()
  fechaNacimiento: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan@email.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({
    description: 'Contraseña en texto plano (se hashea internamente)',
    example: 'MiContraseña123',
  })
  @IsString()
  @MinLength(6)
  contrasenaHash: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Calle 123',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '3001234567',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ description: 'Estado de la cuenta', example: true })
  @IsBoolean()
  estadoCuenta: boolean;

  @ApiPropertyOptional({
    description: 'Preferencias literarias del usuario (nombres)',
    example: ['Romance', 'Thriller'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferencias?: string[];
}
