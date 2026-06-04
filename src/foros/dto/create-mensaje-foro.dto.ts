import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMensajeForoDto {
  @ApiProperty({ description: 'Contenido del mensaje', example: 'Tu pedido está en camino.' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  contenido: string;
}
