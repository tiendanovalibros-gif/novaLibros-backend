import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ForosService } from './foros.service';
import { CreateForoDto } from './dto/create-foro.dto';
import { UpdateForoDto } from './dto/update-foro.dto';
import { AuthGuard, RolesGuard, Public, Roles } from '../common';

@ApiTags('foros')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('foros')
export class ForosController {
  constructor(private readonly forosService: ForosService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createForoDto: CreateForoDto) {
    return this.forosService.create(createForoDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.forosService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forosService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForoDto: UpdateForoDto) {
    return this.forosService.update(+id, updateForoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forosService.remove(+id);
  }
}
