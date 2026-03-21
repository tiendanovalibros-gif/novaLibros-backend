import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovimientosSaldoService } from './movimientos-saldo.service';
import { CreateMovimientosSaldoDto } from './dto/create-movimientos-saldo.dto';
import { UpdateMovimientosSaldoDto } from './dto/update-movimientos-saldo.dto';

@Controller('movimientos-saldo')
export class MovimientosSaldoController {
  constructor(private readonly movimientosSaldoService: MovimientosSaldoService) {}

  @Post()
  create(@Body() createMovimientosSaldoDto: CreateMovimientosSaldoDto) {
    return this.movimientosSaldoService.create(createMovimientosSaldoDto);
  }

  @Get()
  findAll() {
    return this.movimientosSaldoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientosSaldoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovimientosSaldoDto: UpdateMovimientosSaldoDto) {
    return this.movimientosSaldoService.update(+id, updateMovimientosSaldoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientosSaldoService.remove(+id);
  }
}
