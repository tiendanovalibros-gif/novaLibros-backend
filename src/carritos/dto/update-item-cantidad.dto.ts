import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemCantidadDto {
  @ApiProperty({
    description: 'Cantidad final del item en el carrito',
    example: 2,
    minimum: 1,
  })
  cantidad: number;
}
