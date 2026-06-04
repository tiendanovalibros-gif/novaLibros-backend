import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from '../common';

/**
 * Las rutas de mensajes se exponen a través de /foros/:id/mensajes.
 * Este controlador se mantiene como stub para no romper el módulo.
 */
@ApiTags('mensajes')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('mensajes')
export class MensajesController {}
