import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstadosPedidoService } from './estados-pedido.service';
import { CreateEstadosPedidoDto } from './dto/create-estados-pedido.dto';
import { UpdateEstadosPedidoDto } from './dto/update-estados-pedido.dto';

@Controller('estados-pedido')
export class EstadosPedidoController {
  constructor(private readonly estadosPedidoService: EstadosPedidoService) {}

  @Post()
  create(@Body() createEstadosPedidoDto: CreateEstadosPedidoDto) {
    return this.estadosPedidoService.create(createEstadosPedidoDto);
  }

  @Get()
  findAll() {
    return this.estadosPedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosPedidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstadosPedidoDto: UpdateEstadosPedidoDto) {
    return this.estadosPedidoService.update(+id, updateEstadosPedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadosPedidoService.remove(+id);
  }
}
