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
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { AuthGuard, RolesGuard, Roles, UuidPipe, CurrentUser } from '../common';
import type { JwtPayload } from '../utils';

@ApiTags('pedidos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  // ── Nuevo ──────────────────────────────────────────────────────────────────
  @Roles('cliente', 'administrador')
  @Get('me')
  findMisPedidos(@CurrentUser() currentUser: JwtPayload) {
    return this.pedidosService.findMisPedidos(currentUser.sub);
  }

  @Roles('cliente', 'administrador')
  @Get(':id')
  findOne(
    @Param('id', UuidPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.pedidosService.findOneForUser(id, currentUser);
  }

  @Roles('administrador')
  @Patch(':id')
  update(
    @Param('id', UuidPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', UuidPipe) id: string) {
    return this.pedidosService.remove(id);
  }
}
