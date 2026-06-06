import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../utils';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPedidoDto: CreatePedidoDto) {
    return this.prisma.pedido.create({ data: createPedidoDto as any });
  }

  findAll() {
    return this.prisma.pedido.findMany();
  }

  findOne(id: string) {
    return this.prisma.pedido.findUnique({ where: { id } });
  }

  // ── Nuevo: listar pedidos del usuario autenticado ──────────────────────────
  async findMisPedidos(idUsuario: string) {
    const pedidos = await this.prisma.pedido.findMany({
      where: { idUsuario },
      include: {
        itemsPedido: {
          include: {
            libro: {
              select: {
                id: true,
                titulo: true,
                isbn: true,
                imagenPortada: true,
              },
            },
          },
          orderBy: { id: 'asc' },
        },
        estadosPedido: {
          orderBy: { fechaCambio: 'desc' },
          take: 1,
        },
        facturas: { select: { id: true } },
        devoluciones: { select: { id: true, estado: true } },
      },
      orderBy: { fechaOrden: 'desc' },
    });

    return pedidos.map((p) => ({
      id: p.id,
      numeroOrden: p.numeroOrden,
      fechaOrden: p.fechaOrden,
      montoTotal: p.montoTotal,
      metodoEntrega: p.metodoEntrega,
      estadoActual: p.estadosPedido[0]?.estado ?? 'en_preparacion',
      totalItems: p.itemsPedido.reduce((acc, i) => acc + i.cantidad, 0),
      portadas: p.itemsPedido
        .slice(0, 3)
        .map((i) => i.libro.imagenPortada ?? null),
      tieneFactura: p.facturas.length > 0,
      devolucion: p.devoluciones[0] ?? null,
    }));
  }

  async findOneForUser(id: string, currentUser: JwtPayload) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        itemsPedido: {
          include: {
            libro: {
              select: {
                id: true,
                titulo: true,
                isbn: true,
                imagenPortada: true,
              },
            },
          },
          orderBy: { id: 'asc' },
        },
        tienda: {
          include: { ciudad: true },
        },
        estadosPedido: {
          orderBy: { fechaCambio: 'desc' },
          take: 1,
        },
        facturas: { select: { id: true } },
        devoluciones: { select: { id: true, estado: true } },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    const esPropio = pedido.idUsuario === currentUser.sub;
    const esAdmin =
      currentUser.rol === 'administrador' || currentUser.rol === 'root';

    if (!esPropio && !esAdmin) {
      throw new ForbiddenException('No autorizado para ver este pedido');
    }

    const subtotal = pedido.itemsPedido.reduce(
      (acc, item) => acc + Number(item.precioUnitario) * item.cantidad,
      0,
    );
    const montoTotal = Number(pedido.montoTotal);
    const costoEnvio = Math.max(0, montoTotal - subtotal);

    return {
      id: pedido.id,
      numeroOrden: pedido.numeroOrden,
      fechaOrden: pedido.fechaOrden,
      montoTotal: pedido.montoTotal,
      subtotal,
      costoEnvio,
      metodoEntrega: pedido.metodoEntrega,
      direccionEntrega: pedido.direccionEntrega,
      idTienda: pedido.idTienda,
      tienda: pedido.tienda
        ? {
            id: pedido.tienda.id,
            nombre: pedido.tienda.nombre,
            direccion: pedido.tienda.direccion,
            direccionNormalizada: pedido.tienda.direccionNormalizada,
            ciudad: pedido.tienda.ciudad?.nombre ?? null,
            latitud: Number(pedido.tienda.latitud),
            longitud: Number(pedido.tienda.longitud),
          }
        : null,
      estadoActual: pedido.estadosPedido[0]?.estado ?? 'en_preparacion',
      tieneFactura: pedido.facturas.length > 0,
      facturaId: pedido.facturas[0]?.id ?? null,
      devolucion: pedido.devoluciones[0] ?? null,
      items: pedido.itemsPedido.map((item) => ({
        id: item.id,
        idLibro: item.idLibro,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotalLinea: Number(item.precioUnitario) * item.cantidad,
        libro: item.libro,
      })),
    };
  }

  update(id: string, updatePedidoDto: UpdatePedidoDto) {
    return this.prisma.pedido.update({
      where: { id },
      data: updatePedidoDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.pedido.delete({ where: { id } });
  }
}
