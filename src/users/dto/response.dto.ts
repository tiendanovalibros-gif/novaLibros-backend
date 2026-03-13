import { ApiProperty } from '@nestjs/swagger';

export class UsuarioResponseDto {
  @ApiProperty({ description: 'ID del usuario (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  apellido: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan@email.com' })
  correo: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'cliente' })
  rol: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Token JWT de acceso', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ description: 'Datos del usuario autenticado', type: UsuarioResponseDto })
  usuario: UsuarioResponseDto;
}

export class RegisterResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '1234567890' })
  dni: string;

  @ApiProperty({ example: 'Juan' })
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  apellido: string;

  @ApiProperty({ example: '1995-06-15T00:00:00.000Z' })
  fechaNacimiento: string;

  @ApiProperty({ example: 'juan@email.com' })
  correo: string;

  @ApiProperty({ example: 'cliente' })
  rol: string;

  @ApiProperty({ example: true })
  estadoCuenta: boolean;

  @ApiProperty({ example: '2026-03-13T19:00:00.000Z' })
  fechaRegistro: string;
}
