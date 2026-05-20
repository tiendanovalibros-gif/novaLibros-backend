import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateItemCantidadDto {
  @ApiProperty({
    description: 'Cantidad final del item en el carrito',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  cantidad: number;
}
