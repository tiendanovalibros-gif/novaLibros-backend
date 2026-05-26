import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmarMetodoPagoDto {
  @ApiProperty({
    description: 'ID del PaymentMethod devuelto por Stripe tras el SetupIntent',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @ApiProperty({ enum: ['credito', 'debito'] })
  @IsIn(['credito', 'debito'])
  tipo: 'credito' | 'debito';

  @ApiProperty({ description: 'Nombre del titular de la tarjeta' })
  @IsString()
  @IsNotEmpty()
  titular: string;
}
