import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';

@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  @Post()
  create(@Body() createDevolucioneDto: CreateDevolucioneDto) {
    return this.devolucionesService.create(createDevolucioneDto);
  }

  @Get()
  findAll() {
    return this.devolucionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devolucionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevolucioneDto: UpdateDevolucioneDto) {
    return this.devolucionesService.update(id, updateDevolucioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devolucionesService.remove(id);
  }
}
