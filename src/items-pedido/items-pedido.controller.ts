import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsPedidoService } from './items-pedido.service';
import { CreateItemsPedidoDto } from './dto/create-items-pedido.dto';
import { UpdateItemsPedidoDto } from './dto/update-items-pedido.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('items-pedido')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('items-pedido')
export class ItemsPedidoController {
  constructor(private readonly itemsPedidoService: ItemsPedidoService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createItemsPedidoDto: CreateItemsPedidoDto) {
    return this.itemsPedidoService.create(createItemsPedidoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.itemsPedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsPedidoService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemsPedidoDto: UpdateItemsPedidoDto) {
    return this.itemsPedidoService.update(+id, updateItemsPedidoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsPedidoService.remove(+id);
  }
}
