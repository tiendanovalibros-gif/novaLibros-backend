import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'juan@email.com',
  })
  correo?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '3001234567',
  })
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Calle 123',
  })
  direccion?: string;
}
