import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDevolucioneDto {
  @ApiProperty({ description: 'ID del pedido a devolver', example: 'uuid-pedido' })
  idPedido: string;

  @ApiProperty({ description: 'ID del usuario que realiza la devolución', example: 'uuid-usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Razón de la devolución', example: 'Producto dañado' })
  razon: string;

  @ApiPropertyOptional({ description: 'Descripción detallada de la devolución', example: 'El libro llegó con páginas rotas' })
  descripcion?: string;

  @ApiProperty({ description: 'Estado de la devolución', example: 'pendiente' })
  estado: string;

  @ApiPropertyOptional({ description: 'Código QR para seguimiento', example: 'QR123456789' })
  codigoQr?: string;
}
