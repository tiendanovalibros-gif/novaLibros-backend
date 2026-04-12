import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Uuid del token de restablecimiento de contraseña',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'NewPassword123',
  })
  nuevaContrasena: string;
}
