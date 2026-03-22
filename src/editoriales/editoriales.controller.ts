import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EditorialesService } from './editoriales.service';
import { CreateEditorialeDto } from './dto/create-editoriale.dto';
import { UpdateEditorialeDto } from './dto/update-editoriale.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';

@ApiTags('editoriales')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('editoriales')
export class EditorialesController {
  constructor(private readonly editorialesService: EditorialesService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createEditorialeDto: CreateEditorialeDto) {
    return this.editorialesService.create(createEditorialeDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.editorialesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.editorialesService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEditorialeDto: UpdateEditorialeDto) {
    return this.editorialesService.update(+id, updateEditorialeDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.editorialesService.remove(+id);
  }
}
