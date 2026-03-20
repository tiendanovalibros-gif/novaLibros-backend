import { ApiProperty } from '@nestjs/swagger';

export class CreateBonosCumpleanioDto {
  @ApiProperty({ description: 'ID del usuario', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Porcentaje de descuento', example: 15 })
  porcentajeDescuento: number;

  @ApiProperty({ description: 'Fecha de vigencia (ISO 8601)', example: '2026-12-31' })
  fechaVigencia: string;
}
