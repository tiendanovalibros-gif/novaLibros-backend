import { ApiProperty } from '@nestjs/swagger';

export class CreateAutoreDto {
  @ApiProperty({ description: 'Nombre del autor', example: 'Gabriel García Márquez' })
  nombre: string;
}
