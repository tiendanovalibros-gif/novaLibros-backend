import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetodoEntrega } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CheckoutCarritoDto {
  @ApiProperty({
    description: 'Método de entrega elegido',
    enum: MetodoEntrega,
    example: MetodoEntrega.tienda,
  })
  @IsEnum(MetodoEntrega)
  metodoEntrega: MetodoEntrega;

  @ApiPropertyOptional({
    description: 'ID de tienda (obligatorio si metodoEntrega es tienda)',
    example: 1,
  })
  @ValidateIf((o) => o.metodoEntrega === MetodoEntrega.tienda)
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idTienda?: number;

  @ApiPropertyOptional({
    description: 'Dirección de entrega (obligatorio para domicilio y express)',
    example: 'Calle 123 #45-67, Bogotá',
  })
  @ValidateIf(
    (o) =>
      o.metodoEntrega === MetodoEntrega.domicilio ||
      o.metodoEntrega === MetodoEntrega.express,
  )
  @IsString()
  @MinLength(10, { message: 'La dirección debe tener al menos 10 caracteres' })
  direccionEntrega?: string;

  @ApiPropertyOptional({
    description: 'Latitud del cliente (requerida para validar entrega express)',
  })
  @ValidateIf((o) => o.metodoEntrega === MetodoEntrega.express)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({
    description: 'Longitud del cliente (requerida para validar entrega express)',
  })
  @ValidateIf((o) => o.metodoEntrega === MetodoEntrega.express)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;
}
