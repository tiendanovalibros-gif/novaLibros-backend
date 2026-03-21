import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BonosCumpleaniosService } from './bonos-cumpleanios.service';
import { CreateBonosCumpleanioDto } from './dto/create-bonos-cumpleanio.dto';
import { UpdateBonosCumpleanioDto } from './dto/update-bonos-cumpleanio.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@UseGuards(AuthGuard, RolesGuard)
@Controller('bonos-cumpleanios')
export class BonosCumpleaniosController {
  constructor(private readonly bonosCumpleaniosService: BonosCumpleaniosService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createBonosCumpleanioDto: CreateBonosCumpleanioDto) {
    return this.bonosCumpleaniosService.create(createBonosCumpleanioDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.bonosCumpleaniosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonosCumpleaniosService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBonosCumpleanioDto: UpdateBonosCumpleanioDto) {
    return this.bonosCumpleaniosService.update(+id, updateBonosCumpleanioDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonosCumpleaniosService.remove(+id);
  }
}
