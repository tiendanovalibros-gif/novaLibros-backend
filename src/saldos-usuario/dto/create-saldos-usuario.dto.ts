import { ApiProperty } from '@nestjs/swagger';

export class CreateSaldosUsuarioDto {
  @ApiProperty({ description: 'ID del usuario', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Saldo disponible en la cuenta', example: 500.00 })
  saldoDisponible: number;
}
