import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MovimientosSaldoService } from './movimientos-saldo.service';
import { CreateMovimientosSaldoDto } from './dto/create-movimientos-saldo.dto';
import { UpdateMovimientosSaldoDto } from './dto/update-movimientos-saldo.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@UseGuards(AuthGuard, RolesGuard)
@Controller('movimientos-saldo')
export class MovimientosSaldoController {
  constructor(private readonly movimientosSaldoService: MovimientosSaldoService) {}

  @Post()
  create(@Body() createMovimientosSaldoDto: CreateMovimientosSaldoDto) {
    return this.movimientosSaldoService.create(createMovimientosSaldoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.movimientosSaldoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientosSaldoService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovimientosSaldoDto: UpdateMovimientosSaldoDto) {
    return this.movimientosSaldoService.update(+id, updateMovimientosSaldoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientosSaldoService.remove(+id);
  }
}
