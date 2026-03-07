import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EditorialesService } from './editoriales.service';
import { CreateEditorialeDto } from './dto/create-editoriale.dto';
import { UpdateEditorialeDto } from './dto/update-editoriale.dto';

@Controller('editoriales')
export class EditorialesController {
  constructor(private readonly editorialesService: EditorialesService) {}

  @Post()
  create(@Body() createEditorialeDto: CreateEditorialeDto) {
    return this.editorialesService.create(createEditorialeDto);
  }

  @Get()
  findAll() {
    return this.editorialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.editorialesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEditorialeDto: UpdateEditorialeDto) {
    return this.editorialesService.update(+id, updateEditorialeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.editorialesService.remove(+id);
  }
}
