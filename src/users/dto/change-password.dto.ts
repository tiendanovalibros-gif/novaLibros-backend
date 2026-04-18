import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contrasena actual del usuario',
    example: 'MiContrasena123!',
  })
  contrasenaActual: string;

  @ApiProperty({
    description: 'Nueva contrasena del usuario',
    example: 'NuevaContrasena456!',
  })
  nuevaContrasena: string;
}
