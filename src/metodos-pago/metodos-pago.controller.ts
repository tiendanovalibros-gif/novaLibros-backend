import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
import { ConfirmarMetodoPagoDto } from './dto/confirmar-metodo-pago.dto';
import { AuthGuard, RolesGuard, Roles } from '../common';

@ApiTags('metodos-pago')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  // ─── Stripe ─────────────────────────────────────────────────────────────────

  /**
   * POST /metodos-pago/setup-intent
   * Crea un SetupIntent en Stripe y devuelve el clientSecret al frontend.
   * El frontend lo usa para mostrar el formulario de tarjeta de Stripe.
   */
  @ApiOperation({
    summary: 'Crear SetupIntent para registrar tarjeta vía Stripe',
  })
  @Post('setup-intent')
  createSetupIntent(@Request() req) {
    return this.metodosPagoService.createSetupIntent(req.user.sub);
  }

  /**
   * POST /metodos-pago/confirmar
   * Guarda la tarjeta en BD después de que el frontend confirmó el SetupIntent.
   * Recibe el paymentMethodId de Stripe.
   */
  @ApiOperation({
    summary: 'Confirmar y guardar tarjeta tras el SetupIntent de Stripe',
  })
  @Post('confirmar')
  confirmarTarjeta(@Request() req, @Body() dto: ConfirmarMetodoPagoDto) {
    return this.metodosPagoService.confirmarYGuardarTarjeta(req.user.sub, dto);
  }

  // ─── Rutas existentes (sin cambios) ─────────────────────────────────────────

  @Post()
  create(@Request() req, @Body() createMetodosPagoDto: CreateMetodosPagoDto) {
    return this.metodosPagoService.createForUsuario(
      req.user.sub,
      createMetodosPagoDto,
    );
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.metodosPagoService.findAll();
  }

  @Get('me')
  findMine(@Request() req) {
    return this.metodosPagoService.findByUsuario(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodosPagoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMetodosPagoDto: UpdateMetodosPagoDto,
  ) {
    return this.metodosPagoService.update(+id, updateMetodosPagoDto);
  }

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
