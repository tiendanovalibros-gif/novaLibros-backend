import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ForosService } from './foros.service';
import { CreateForoClienteDto } from './dto/create-foro-cliente.dto';
import { CreateMensajeForoDto } from './dto/create-mensaje-foro.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';
import type { JwtPayload } from '../utils';

interface AuthRequest extends Request {
  user: JwtPayload;
}

@ApiTags('foros')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('foros')
export class ForosController {
  constructor(private readonly forosService: ForosService) {}

  // ── Cliente ────────────────────────────────────────────────────────────────

  /** Crear nuevo chat de soporte */
  @Roles('cliente')
  @Post('me')
  crearMiForo(@Req() req: AuthRequest, @Body() dto: CreateForoClienteDto) {
    return this.forosService.crearMiForo(req.user, dto);
  }

  /** Listar los chats del cliente autenticado */
  @Roles('cliente')
  @Get('me')
  listarMisForos(@Req() req: AuthRequest) {
    return this.forosService.listarMisForos(req.user.sub);
  }

  /** Detalle de un chat propio */
  @Roles('cliente')
  @Get('me/:id')
  obtenerMiForo(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.forosService.obtenerMiForo(id, req.user.sub);
  }

  /** Enviar mensaje en un foro propio */
  @Roles('cliente')
  @Post('me/:id/mensajes')
  enviarMensajeCliente(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMensajeForoDto,
  ) {
    return this.forosService.enviarMensaje(id, req.user, dto);
  }

  // ── Admin / Root ───────────────────────────────────────────────────────────

  /** Bandeja: todos los foros */
  @Roles('administrador')
  @Get()
  listarTodos(@Req() req: AuthRequest) {
    return this.forosService.listarTodos(req.user);
  }

  /** Detalle de cualquier foro */
  @Roles('administrador')
  @Get(':id')
  obtenerForo(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.forosService.obtenerForo(id, req.user);
  }

  /** Responder en cualquier foro */
  @Roles('administrador')
  @Post(':id/mensajes')
  enviarMensajeAdmin(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMensajeForoDto,
  ) {
    return this.forosService.enviarMensaje(id, req.user, dto);
  }

  /** Listar mensajes de cualquier foro (para polling) */
  @Roles('administrador')
  @Get(':id/mensajes')
  listarMensajesAdmin(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.forosService.listarMensajes(id, req.user);
  }
}
