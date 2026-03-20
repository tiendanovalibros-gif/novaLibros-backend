import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuariosPreferenciaDto } from './create-usuarios-preferencia.dto';

export class UpdateUsuariosPreferenciaDto extends PartialType(CreateUsuariosPreferenciaDto) {}
