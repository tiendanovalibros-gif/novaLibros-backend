import { ApiProperty } from '@nestjs/swagger';

export class CreateEditorialeDto {
  @ApiProperty({ description: 'Nombre de la editorial', example: 'Penguin Books' })
  nombre: string;
}
