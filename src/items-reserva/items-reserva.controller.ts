import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsReservaService } from './items-reserva.service';
import { CreateItemsReservaDto } from './dto/create-items-reserva.dto';
import { UpdateItemsReservaDto } from './dto/update-items-reserva.dto';

@Controller('items-reserva')
export class ItemsReservaController {
  constructor(private readonly itemsReservaService: ItemsReservaService) {}

  @Post()
  create(@Body() createItemsReservaDto: CreateItemsReservaDto) {
    return this.itemsReservaService.create(createItemsReservaDto);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsReservaService.remove(+id);
  }
}
