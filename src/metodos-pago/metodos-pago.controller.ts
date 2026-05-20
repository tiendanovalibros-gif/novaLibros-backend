import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('metodos-pago')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  @Post()
  create(@Body() createMetodosPagoDto: CreateMetodosPagoDto) {
    return this.metodosPagoService.create(createMetodosPagoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.metodosPagoService.findAll();
  }

  // Ruta: GET /metodos-pago/me
  // Devuelve los metodos de pago del usuario autenticado
  @Get('me')
  findMine(@Request() req) {
    return this.metodosPagoService.findByUsuario(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodosPagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodosPagoDto: UpdateMetodosPagoDto) {
    return this.metodosPagoService.update(+id, updateMetodosPagoDto);
  }

  // Ruta: DELETE /metodos-pago/me/:id
  // El usuario solo puede borrar sus propias tarjetas
  @Delete('me/:id')
  removeMine(@Param('id') id: string, @Request() req) {
    return this.metodosPagoService.removeIfOwner(+id, req.user.sub);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodosPagoService.remove(+id);
  }
}
