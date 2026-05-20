import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'juan@email.com',
  })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '3001234567',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Calle 123',
  })
  @IsOptional()
  @IsString()
  direccion?: string;
}
