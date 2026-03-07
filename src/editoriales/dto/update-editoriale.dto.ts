import { PartialType } from '@nestjs/mapped-types';
import { CreateEditorialeDto } from './create-editoriale.dto';

export class UpdateEditorialeDto extends PartialType(CreateEditorialeDto) {}
