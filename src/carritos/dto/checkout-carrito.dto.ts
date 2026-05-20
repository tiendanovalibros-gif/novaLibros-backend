import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutCarritoDto {
  @ApiPropertyOptional({
    description: 'Metodo de entrega',
    example: 'domicilio',
  })
  metodoEntrega?: string;

  @ApiPropertyOptional({
    description: 'Direccion de entrega',
    example: 'Calle 123 #45-67',
  })
  direccionEntrega?: string;
}
