import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosPreferenciasService } from './usuarios-preferencias.service';
import { CreateUsuariosPreferenciaDto } from './dto/create-usuarios-preferencia.dto';
import { UpdateUsuariosPreferenciaDto } from './dto/update-usuarios-preferencia.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@UseGuards(AuthGuard, RolesGuard)
@Controller('usuarios-preferencias')
export class UsuariosPreferenciasController {
  constructor(private readonly usuariosPreferenciasService: UsuariosPreferenciasService) {}

  @Post()
  create(@Body() createUsuariosPreferenciaDto: CreateUsuariosPreferenciaDto) {
    return this.usuariosPreferenciasService.create(createUsuariosPreferenciaDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.usuariosPreferenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosPreferenciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuariosPreferenciaDto: UpdateUsuariosPreferenciaDto) {
    return this.usuariosPreferenciasService.update(+id, updateUsuariosPreferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosPreferenciasService.remove(+id);
  }
}
