import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contrasena actual del usuario',
    example: 'MiContrasena123!',
  })
  @IsString()
  @MinLength(1)
  contrasenaActual: string;

  @ApiProperty({
    description: 'Nueva contrasena del usuario',
    example: 'NuevaContrasena456!',
  })
  @IsString()
  @MinLength(6)
  nuevaContrasena: string;
}
