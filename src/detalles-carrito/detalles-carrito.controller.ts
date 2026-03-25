import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DetallesCarritoService } from './detalles-carrito.service';
import { CreateDetallesCarritoDto } from './dto/create-detalles-carrito.dto';
import { UpdateDetallesCarritoDto } from './dto/update-detalles-carrito.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('detalles-carrito')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('detalles-carrito')
export class DetallesCarritoController {
  constructor(private readonly detallesCarritoService: DetallesCarritoService) {}

  @Post()
  create(@Body() createDetallesCarritoDto: CreateDetallesCarritoDto) {
    return this.detallesCarritoService.create(createDetallesCarritoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.detallesCarritoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesCarritoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesCarritoDto: UpdateDetallesCarritoDto) {
    return this.detallesCarritoService.update(+id, updateDetallesCarritoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesCarritoService.remove(+id);
  }
}
