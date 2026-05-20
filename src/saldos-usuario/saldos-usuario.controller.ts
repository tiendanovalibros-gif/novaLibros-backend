import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SaldosUsuarioService } from './saldos-usuario.service';
import { CreateSaldosUsuarioDto } from './dto/create-saldos-usuario.dto';
import { UpdateSaldosUsuarioDto } from './dto/update-saldos-usuario.dto';
import { RecargarSaldoDto } from './dto/recargar-saldo.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('saldos-usuario')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('saldos-usuario')
export class SaldosUsuarioController {
  constructor(private readonly saldosUsuarioService: SaldosUsuarioService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createSaldosUsuarioDto: CreateSaldosUsuarioDto) {
    return this.saldosUsuarioService.create(createSaldosUsuarioDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.saldosUsuarioService.findAll();
  }

  // Ruta: GET /saldos-usuario/me
  // Devuelve el saldo del usuario autenticado (o saldo en cero si no existe)
  @Get('me')
  findMine(@Request() req) {
    return this.saldosUsuarioService.findByUsuario(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saldosUsuarioService.findOne(+id);
  }

  // Ruta: PATCH /saldos-usuario/me/recargar
  // El usuario recarga su propio saldo
  @Patch('me/recargar')
  recargarMio(@Request() req, @Body() body: RecargarSaldoDto) {
    return this.saldosUsuarioService.recargar(req.user.sub, body);
  }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaldosUsuarioDto: UpdateSaldosUsuarioDto) {
    return this.saldosUsuarioService.update(+id, updateSaldosUsuarioDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saldosUsuarioService.remove(+id);
  }
}
