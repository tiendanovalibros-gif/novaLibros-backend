import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Documento de identidad', example: '1234567890' })
  dni: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  apellido: string;

  @ApiProperty({
    description: 'Fecha de nacimiento (ISO 8601)',
    example: '1995-06-15',
  })
  fechaNacimiento: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan@email.com' })
  correo: string;

  @ApiProperty({
    description: 'Contraseña en texto plano (se hashea internamente)',
    example: 'MiContraseña123',
  })
  contrasenaHash: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Calle 123',
  })
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '3001234567',
  })
  telefono?: string;

  @ApiProperty({ description: 'Estado de la cuenta', example: true })
  estadoCuenta: boolean;
}
