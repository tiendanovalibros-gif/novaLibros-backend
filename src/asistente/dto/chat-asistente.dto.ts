import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChatAsistenteDto {
  @ApiProperty({ description: 'Mensaje del usuario', example: '¿Qué libros de García Márquez tienen?' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  mensaje: string;
}
