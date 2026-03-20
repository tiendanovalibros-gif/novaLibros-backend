import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrosBusquedaDto } from './create-registros-busqueda.dto';

export class UpdateRegistrosBusquedaDto extends PartialType(CreateRegistrosBusquedaDto) {}
