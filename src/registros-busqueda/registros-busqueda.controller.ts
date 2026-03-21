import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistrosBusquedaService } from './registros-busqueda.service';
import { CreateRegistrosBusquedaDto } from './dto/create-registros-busqueda.dto';
import { UpdateRegistrosBusquedaDto } from './dto/update-registros-busqueda.dto';

@Controller('registros-busqueda')
export class RegistrosBusquedaController {
  constructor(private readonly registrosBusquedaService: RegistrosBusquedaService) {}

  @Post()
  create(@Body() createRegistrosBusquedaDto: CreateRegistrosBusquedaDto) {
    return this.registrosBusquedaService.create(createRegistrosBusquedaDto);
  }

  @Get()
  findAll() {
    return this.registrosBusquedaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrosBusquedaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrosBusquedaDto: UpdateRegistrosBusquedaDto) {
    return this.registrosBusquedaService.update(+id, updateRegistrosBusquedaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrosBusquedaService.remove(+id);
  }
}
