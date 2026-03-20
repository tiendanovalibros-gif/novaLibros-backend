import { PartialType } from '@nestjs/mapped-types';
import { CreatePreferenciasLiterariaDto } from './create-preferencias-literaria.dto';

export class UpdatePreferenciasLiterariaDto extends PartialType(CreatePreferenciasLiterariaDto) {}
