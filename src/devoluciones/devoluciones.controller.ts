import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';
import { AuthGuard, RolesGuard, Roles, UuidPipe, CurrentUser } from '../common';
import type { JwtPayload } from '../utils';

class SolicitarDevolucionDto {
  idPedido: string;
  razon: string;
  descripcion?: string;
}

class CambiarEstadoDto {
  estado: 'aprobada' | 'rechazada';
}

@ApiTags('devoluciones')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  @Roles('administrador')
  @Post()
  create(@Body() createDevolucioneDto: CreateDevolucioneDto) {
    return this.devolucionesService.create(createDevolucioneDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.devolucionesService.findAll();
  }

  // ── Nuevos (cliente) ───────────────────────────────────────────────────────
  @Roles('cliente')
  @Post('me')
  solicitarDevolucion(
    @CurrentUser() currentUser: JwtPayload,
    @Body() body: SolicitarDevolucionDto,
  ) {
    return this.devolucionesService.solicitarDevolucion(
      currentUser.sub,
      body.idPedido,
      body.razon,
      body.descripcion,
    );
  }

  @Roles('cliente')
  @Get('me')
  findMisDevoluciones(@CurrentUser() currentUser: JwtPayload) {
    return this.devolucionesService.findMisDevoluciones(currentUser.sub);
  }

  // ── Nuevo (admin) ──────────────────────────────────────────────────────────
  @Roles('administrador')
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', UuidPipe) id: string,
    @Body() body: CambiarEstadoDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.devolucionesService.cambiarEstado(id, body.estado, currentUser);
  }

  @Get(':id')
  findOne(@Param('id', UuidPipe) id: string) {
    return this.devolucionesService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(
    @Param('id', UuidPipe) id: string,
    @Body() updateDevolucioneDto: UpdateDevolucioneDto,
  ) {
    return this.devolucionesService.update(id, updateDevolucioneDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', UuidPipe) id: string) {
    return this.devolucionesService.remove(id);
  }
}
