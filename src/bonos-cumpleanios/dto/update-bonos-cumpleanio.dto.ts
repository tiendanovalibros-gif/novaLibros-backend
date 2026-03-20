import { PartialType } from '@nestjs/mapped-types';
import { CreateBonosCumpleanioDto } from './create-bonos-cumpleanio.dto';

export class UpdateBonosCumpleanioDto extends PartialType(CreateBonosCumpleanioDto) {}
