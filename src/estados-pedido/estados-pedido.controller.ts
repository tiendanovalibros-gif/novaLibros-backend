import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EstadosPedidoService } from './estados-pedido.service';
import { CreateEstadosPedidoDto } from './dto/create-estados-pedido.dto';
import { UpdateEstadosPedidoDto } from './dto/update-estados-pedido.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('estados-pedido')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('estados-pedido')
export class EstadosPedidoController {
  constructor(private readonly estadosPedidoService: EstadosPedidoService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createEstadosPedidoDto: CreateEstadosPedidoDto) {
    return this.estadosPedidoService.create(createEstadosPedidoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.estadosPedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosPedidoService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstadosPedidoDto: UpdateEstadosPedidoDto) {
    return this.estadosPedidoService.update(+id, updateEstadosPedidoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadosPedidoService.remove(+id);
  }
}
