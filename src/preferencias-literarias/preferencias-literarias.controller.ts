import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreferenciasLiterariasService } from './preferencias-literarias.service';
import { CreatePreferenciasLiterariaDto } from './dto/create-preferencias-literaria.dto';
import { UpdatePreferenciasLiterariaDto } from './dto/update-preferencias-literaria.dto';

@Controller('preferencias-literarias')
export class PreferenciasLiterariasController {
  constructor(private readonly preferenciasLiterariasService: PreferenciasLiterariasService) {}

  @Post()
  create(@Body() createPreferenciasLiterariaDto: CreatePreferenciasLiterariaDto) {
    return this.preferenciasLiterariasService.create(createPreferenciasLiterariaDto);
  }

  @Get()
  findAll() {
    return this.preferenciasLiterariasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preferenciasLiterariasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreferenciasLiterariaDto: UpdatePreferenciasLiterariaDto) {
    return this.preferenciasLiterariasService.update(+id, updatePreferenciasLiterariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preferenciasLiterariasService.remove(+id);
  }
}
