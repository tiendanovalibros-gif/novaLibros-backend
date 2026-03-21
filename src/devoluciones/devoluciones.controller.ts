import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@UseGuards(AuthGuard, RolesGuard)
@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  @Post()
  create(@Body() createDevolucioneDto: CreateDevolucioneDto) {
    return this.devolucionesService.create(createDevolucioneDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.devolucionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devolucionesService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevolucioneDto: UpdateDevolucioneDto) {
    return this.devolucionesService.update(id, updateDevolucioneDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devolucionesService.remove(id);
  }
}
