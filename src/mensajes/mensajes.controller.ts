import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MensajesService } from './mensajes.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';

@ApiTags('mensajes')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('mensajes')
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  @Post()
  create(@Body() createMensajeDto: CreateMensajeDto) {
    return this.mensajesService.create(createMensajeDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.mensajesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mensajesService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMensajeDto: UpdateMensajeDto) {
    return this.mensajesService.update(id, updateMensajeDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mensajesService.remove(id);
  }
}
