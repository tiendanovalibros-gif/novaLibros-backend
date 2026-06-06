import { Res } from '@nestjs/common';
import type { Response } from 'express';
import { FacturaPdfService } from './factura-pdf.service';
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
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { AuthGuard, RolesGuard, Roles, UuidPipe, CurrentUser } from '../common';
import type { JwtPayload } from '../utils';

@ApiTags('facturas')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('facturas')
export class FacturasController {
  constructor(
    private readonly facturasService: FacturasService,
    private readonly facturaPdfService: FacturaPdfService,
  ) {}

  @Roles('administrador')
  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @Roles('administrador')
  @Get()
  findAll() {
    return this.facturasService.findAll();
  }

  // ── Nuevos ─────────────────────────────────────────────────────────────────
  @Roles('cliente', 'administrador')
  @Get('me')
  findMisFacturas(@CurrentUser() currentUser: JwtPayload) {
    return this.facturasService.findMisFacturas(currentUser.sub);
  }

  @Roles('cliente', 'administrador')
  @Post('generar/:idPedido')
  generarFactura(
    @Param('idPedido', UuidPipe) idPedido: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.facturasService.generarParaPedido(idPedido, currentUser.sub);
  }

  @Roles('cliente', 'administrador')
  @Get(':id/pdf')
  async descargarPdf(
    @Param('id', UuidPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Res() res: Response,
  ) {
    const factura = await this.facturasService.obtenerDatosParaPdf(
      id,
      currentUser.sub,
    );

    const pedido = factura.pedido;
    const usuario = pedido.usuario;

    const subtotal = Number(factura.montoSubtotal);
    const iva = Number(factura.iva);
    const montoTotal = Number(factura.montoTotal);

    this.facturaPdfService.generarPdf(
      {
        numeroOrden: pedido.numeroOrden,
        fechaOrden: pedido.fechaOrden,
        nombreUsuario: `${usuario.nombre} ${usuario.apellido}`.trim(),
        correoUsuario: usuario.correo,
        items: pedido.itemsPedido.map((item) => ({
          titulo: item.libro.titulo,
          cantidad: item.cantidad,
          precioUnitario: Number(item.precioUnitario),
          subtotalLinea: Number(item.precioUnitario) * item.cantidad,
        })),
        subtotal,
        iva,
        montoTotal,
      },
      res,
    );
  }

  @Get(':id')
  findOne(@Param('id', UuidPipe) id: string) {
    return this.facturasService.findOne(id);
  }

  @Roles('administrador')
  @Patch(':id')
  update(
    @Param('id', UuidPipe) id: string,
    @Body() updateFacturaDto: UpdateFacturaDto,
  ) {
    return this.facturasService.update(id, updateFacturaDto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', UuidPipe) id: string) {
    return this.facturasService.remove(id);
  }
}
