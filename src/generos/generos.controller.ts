import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';

@ApiTags('generos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createGeneroDto: CreateGeneroDto) {
    return this.generosService.create(createGeneroDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.generosService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generosService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneroDto: UpdateGeneroDto) {
    return this.generosService.update(+id, updateGeneroDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generosService.remove(+id);
  }
}
