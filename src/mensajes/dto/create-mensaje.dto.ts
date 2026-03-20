import { ApiProperty } from '@nestjs/swagger';

export class CreateMensajeDto {
  @ApiProperty({ description: 'ID del foro donde se publica el mensaje', example: 1 })
  idForo: number;

  @ApiProperty({ description: 'ID del usuario que envía el mensaje', example: 'uuid-usuario' })
  idRemitente: string;

  @ApiProperty({ description: 'Contenido del mensaje', example: 'Excelente recomendación de libro' })
  contenido: string;

  @ApiProperty({ description: 'Fecha y hora del mensaje (ISO 8601)', example: '2026-03-20T14:30:00Z' })
  fechaHora: string;
}
