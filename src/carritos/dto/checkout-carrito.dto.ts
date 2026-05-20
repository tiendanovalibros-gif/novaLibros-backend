import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsOptional, IsString } from 'class-validator';

export class CheckoutCarritoDto {
  @ApiProperty({
    description: 'ID de la tienda donde el cliente recoge el pedido',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idTienda: number;

  @ApiPropertyOptional({
    description: 'Direccion de entrega (no se usa en recogida en tienda)',
    example: 'Calle 123 #45-67',
  })
  @IsOptional()
  @IsString()
  direccionEntrega?: string;
}
