import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddExistenciasLibroDto {
  @ApiProperty({
    description: 'Cantidad de existencias a agregar al inventario actual',
    example: 10,
  })
  @IsInt()
  @Min(1)
  cantidadAAgregar: number;
}
