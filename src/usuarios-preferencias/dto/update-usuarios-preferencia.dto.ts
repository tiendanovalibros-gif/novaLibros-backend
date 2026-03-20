import { PartialType } from '@nestjs/swagger';
import { CreateUsuariosPreferenciaDto } from './create-usuarios-preferencia.dto';

export class UpdateUsuariosPreferenciaDto extends PartialType(CreateUsuariosPreferenciaDto) {}
