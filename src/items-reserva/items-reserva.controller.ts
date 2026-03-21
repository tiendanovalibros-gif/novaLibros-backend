import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ItemsReservaService } from './items-reserva.service';
import { CreateItemsReservaDto } from './dto/create-items-reserva.dto';
import { UpdateItemsReservaDto } from './dto/update-items-reserva.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@UseGuards(AuthGuard, RolesGuard)
@Controller('items-reserva')
export class ItemsReservaController {
  constructor(private readonly itemsReservaService: ItemsReservaService) {}

  @Post()
  create(@Body() createItemsReservaDto: CreateItemsReservaDto) {
    return this.itemsReservaService.create(createItemsReservaDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.itemsReservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsReservaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemsReservaDto: UpdateItemsReservaDto) {
    return this.itemsReservaService.update(+id, updateItemsReservaDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsReservaService.remove(+id);
  }
}
