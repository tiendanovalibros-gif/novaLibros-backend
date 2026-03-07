import { PartialType } from '@nestjs/mapped-types';
import { CreateSaldosUsuarioDto } from './create-saldos-usuario.dto';

export class UpdateSaldosUsuarioDto extends PartialType(CreateSaldosUsuarioDto) {}
