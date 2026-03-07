import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SaldosUsuarioService } from './saldos-usuario.service';
import { CreateSaldosUsuarioDto } from './dto/create-saldos-usuario.dto';
import { UpdateSaldosUsuarioDto } from './dto/update-saldos-usuario.dto';

@Controller('saldos-usuario')
export class SaldosUsuarioController {
  constructor(private readonly saldosUsuarioService: SaldosUsuarioService) {}

  @Post()
  create(@Body() createSaldosUsuarioDto: CreateSaldosUsuarioDto) {
    return this.saldosUsuarioService.create(createSaldosUsuarioDto);
  }

  @Get()
  findAll() {
    return this.saldosUsuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saldosUsuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaldosUsuarioDto: UpdateSaldosUsuarioDto) {
    return this.saldosUsuarioService.update(+id, updateSaldosUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saldosUsuarioService.remove(+id);
  }
}
