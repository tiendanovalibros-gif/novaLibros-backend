import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { PrismaService } from '../prisma/prisma.service';

const IVA_RATE = 0.19;

@Injectable()
export class FacturasService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Generar factura para un pedido (idempotente) ───────────────────────────
  async generarParaPedido(idPedido: string, idUsuario: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id: idPedido },
      include: {
        facturas: { select: { id: true } },
        estadosPedido: { orderBy: { fechaCambio: 'desc' }, take: 1 },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido ${idPedido} no encontrado`);
    }

    if (pedido.idUsuario !== idUsuario) {
      throw new BadRequestException('El pedido no pertenece a este usuario');
    }

    const estadoActual = pedido.estadosPedido[0]?.estado;
    if (estadoActual !== 'entregado') {
      throw new BadRequestException(
        'Solo se puede generar factura para pedidos entregados',
      );
    }

    if (pedido.facturas.length > 0) {
      // Ya existe — la devolvemos
      return this.prisma.facturaElectronica.findUnique({
        where: { id: pedido.facturas[0].id },
      });
    }

    const montoTotal = Number(pedido.montoTotal);
    const montoSubtotal = parseFloat((montoTotal / (1 + IVA_RATE)).toFixed(2));
    const iva = parseFloat((montoTotal - montoSubtotal).toFixed(2));

    return this.prisma.facturaElectronica.create({
      data: {
        idPedido,
        idUsuario,
        montoSubtotal,
        iva,
        montoTotal,
      },
    });
  }

  // ── Facturas del usuario autenticado ──────────────────────────────────────
  findMisFacturas(idUsuario: string) {
    return this.prisma.facturaElectronica.findMany({
      where: { idUsuario },
      include: {
        pedido: {
          select: {
            id: true,
            numeroOrden: true,
            fechaOrden: true,
            metodoEntrega: true,
          },
        },
      },
      orderBy: { pedido: { fechaOrden: 'desc' } },
    });
  }

  // ── CRUD base (sin cambios) ────────────────────────────────────────────────
  create(createFacturaDto: CreateFacturaDto) {
    return this.prisma.facturaElectronica.create({
      data: createFacturaDto as any,
    });
  }

  findAll() {
    return this.prisma.facturaElectronica.findMany();
  }

  findOne(id: string) {
    return this.prisma.facturaElectronica.findUnique({ where: { id } });
  }

  update(id: string, updateFacturaDto: UpdateFacturaDto) {
    return this.prisma.facturaElectronica.update({
      where: { id },
      data: updateFacturaDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.facturaElectronica.delete({ where: { id } });
  }

  async obtenerDatosParaPdf(idFactura: string, idUsuario: string) {
    const factura = await this.prisma.facturaElectronica.findUnique({
      where: { id: idFactura },
      include: {
        pedido: {
          include: {
            itemsPedido: {
              include: {
                libro: { select: { titulo: true } },
              },
            },
            usuario: {
              select: { nombre: true, apellido: true, correo: true },
            },
          },
        },
      },
    });

    if (!factura)
      throw new NotFoundException(`Factura ${idFactura} no encontrada`);
    if (factura.idUsuario !== idUsuario) {
      const { ForbiddenException } = await import('@nestjs/common');
      throw new ForbiddenException('No autorizado');
    }

    return factura;
  }
}
