import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RegistrosBusquedaService } from './registros-busqueda.service';
import { CreateRegistrosBusquedaDto } from './dto/create-registros-busqueda.dto';
import { UpdateRegistrosBusquedaDto } from './dto/update-registros-busqueda.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('registros-busqueda')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('registros-busqueda')
export class RegistrosBusquedaController {
  constructor(private readonly registrosBusquedaService: RegistrosBusquedaService) { }

  @Post()
  create(@Body() createRegistrosBusquedaDto: CreateRegistrosBusquedaDto) {
    return this.registrosBusquedaService.create(createRegistrosBusquedaDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.registrosBusquedaService.findAll();
  }

  @Roles('administrador')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrosBusquedaService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrosBusquedaDto: UpdateRegistrosBusquedaDto) {
    return this.registrosBusquedaService.update(+id, updateRegistrosBusquedaDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrosBusquedaService.remove(+id);
  }
}
