import { ApiProperty } from '@nestjs/swagger';

export class CreateMetodosPagoDto {
  @ApiProperty({ description: 'ID del usuario propietario del método de pago', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Tipo de método de pago', example: 'tarjeta_credito' })
  tipo: string;

  @ApiProperty({ description: 'Número de tarjeta enmascarado', example: '****-****-****-1234' })
  numeroEnmascarado: string;

  @ApiProperty({ description: 'Nombre del titular de la tarjeta', example: 'Juan Pérez' })
  titular: string;
}
