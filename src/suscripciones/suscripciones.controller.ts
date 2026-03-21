import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service';
import { CreateSuscripcioneDto } from './dto/create-suscripcione.dto';
import { UpdateSuscripcioneDto } from './dto/update-suscripcione.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@UseGuards(AuthGuard, RolesGuard)
@Controller('suscripciones')
export class SuscripcionesController {
  constructor(private readonly suscripcionesService: SuscripcionesService) {}

  @Post()
  create(@Body() createSuscripcioneDto: CreateSuscripcioneDto) {
    return this.suscripcionesService.create(createSuscripcioneDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.suscripcionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suscripcionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuscripcioneDto: UpdateSuscripcioneDto) {
    return this.suscripcionesService.update(+id, updateSuscripcioneDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suscripcionesService.remove(+id);
  }
}
