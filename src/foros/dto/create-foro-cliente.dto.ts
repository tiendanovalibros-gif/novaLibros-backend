import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateForoClienteDto {
  @ApiProperty({ description: 'Asunto / título del chat', example: 'Consulta sobre mi pedido #1234' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  titulo: string;

  @ApiPropertyOptional({ description: 'Mensaje inicial (opcional)', example: 'Hola, quisiera saber el estado de mi pedido.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  contenido?: string;
}
