import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'usuario@email.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'MiContraseña123' })
  @IsString()
  @MinLength(1)
  contrasena: string;
}
