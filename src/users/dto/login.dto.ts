import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@email.com' })
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'MiContraseña123' })
  contrasena: string;
}
