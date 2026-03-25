import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PreferenciasLiterariasService } from './preferencias-literarias.service';
import { CreatePreferenciasLiterariaDto } from './dto/create-preferencias-literaria.dto';
import { UpdatePreferenciasLiterariaDto } from './dto/update-preferencias-literaria.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';

@ApiTags('preferencias-literarias')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('preferencias-literarias')
export class PreferenciasLiterariasController {
  constructor(private readonly preferenciasLiterariasService: PreferenciasLiterariasService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createPreferenciasLiterariaDto: CreatePreferenciasLiterariaDto) {
    return this.preferenciasLiterariasService.create(createPreferenciasLiterariaDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.preferenciasLiterariasService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preferenciasLiterariasService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreferenciasLiterariaDto: UpdatePreferenciasLiterariaDto) {
    return this.preferenciasLiterariasService.update(+id, updatePreferenciasLiterariaDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preferenciasLiterariasService.remove(+id);
  }
}
