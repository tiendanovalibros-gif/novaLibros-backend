import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Uuid del token de restablecimiento de contraseña',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'NewPassword123',
  })
  @IsString()
  @MinLength(6)
  nuevaContrasena: string;
}
