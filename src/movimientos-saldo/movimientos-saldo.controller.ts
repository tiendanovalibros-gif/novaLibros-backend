import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MovimientosSaldoService } from './movimientos-saldo.service';
import { CreateMovimientosSaldoDto } from './dto/create-movimientos-saldo.dto';
import { UpdateMovimientosSaldoDto } from './dto/update-movimientos-saldo.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('movimientos-saldo')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('movimientos-saldo')
export class MovimientosSaldoController {
  constructor(
    private readonly movimientosSaldoService: MovimientosSaldoService,
  ) {}

  @Post()
  create(@Body() createMovimientosSaldoDto: CreateMovimientosSaldoDto) {
    return this.movimientosSaldoService.create(createMovimientosSaldoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.movimientosSaldoService.findAll();
  }

  // Ruta: GET /movimientos-saldo/me
  // Historial de movimientos del usuario autenticado
  @Get('me')
  findMine(@Request() req, @Query('tipo') tipo?: string) {
    return this.movimientosSaldoService.findByUsuario(req.user.sub, tipo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientosSaldoService.findOne(+id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovimientosSaldoDto: UpdateMovimientosSaldoDto,
  ) {
    return this.movimientosSaldoService.update(+id, updateMovimientosSaldoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientosSaldoService.remove(+id);
  }
}
