import { PartialType } from '@nestjs/swagger';
import { CreatePreferenciasLiterariaDto } from './create-preferencias-literaria.dto';

export class UpdatePreferenciasLiterariaDto extends PartialType(CreatePreferenciasLiterariaDto) {}
