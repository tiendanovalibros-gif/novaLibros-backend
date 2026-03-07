import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForosService } from './foros.service';
import { CreateForoDto } from './dto/create-foro.dto';
import { UpdateForoDto } from './dto/update-foro.dto';

@Controller('foros')
export class ForosController {
  constructor(private readonly forosService: ForosService) {}

  @Post()
  create(@Body() createForoDto: CreateForoDto) {
    return this.forosService.create(createForoDto);
  }

  @Get()
  findAll() {
    return this.forosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForoDto: UpdateForoDto) {
    return this.forosService.update(+id, updateForoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forosService.remove(+id);
  }
}
