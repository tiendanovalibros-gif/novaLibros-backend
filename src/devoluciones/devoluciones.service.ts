import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../utils';

@Injectable()
export class DevolucionesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Solicitar devolución (cliente) ─────────────────────────────────────────
  async solicitarDevolucion(
    idUsuario: string,
    idPedido: string,
    razon: string,
    descripcion?: string,
  ) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id: idPedido },
      include: {
        estadosPedido: { orderBy: { fechaCambio: 'desc' }, take: 1 },
        devoluciones: { select: { id: true } },
      },
    });

    if (!pedido)
      throw new NotFoundException(`Pedido ${idPedido} no encontrado`);
    if (pedido.idUsuario !== idUsuario)
      throw new BadRequestException('El pedido no pertenece a este usuario');

    const estadoActual = pedido.estadosPedido[0]?.estado;
    if (estadoActual !== 'entregado')
      throw new BadRequestException(
        'Solo se puede solicitar devolución de pedidos entregados',
      );

    if (pedido.devoluciones.length > 0)
      throw new BadRequestException(
        'Este pedido ya tiene una solicitud de devolución',
      );

    return this.prisma.devolucion.create({
      data: {
        idPedido,
        idUsuario,
        razon,
        descripcion,
        estado: 'solicitada',
      },
    });
  }

  // ── Mis devoluciones (cliente) ─────────────────────────────────────────────
  findMisDevoluciones(idUsuario: string) {
    return this.prisma.devolucion.findMany({
      where: { idUsuario },
      include: {
        pedido: {
          select: {
            id: true,
            numeroOrden: true,
            fechaOrden: true,
          },
        },
      },
      orderBy: { pedido: { fechaOrden: 'desc' } },
    });
  }

  // ── Cambiar estado (admin) + generar QR al aprobar ─────────────────────────
  async cambiarEstado(
    id: string,
    estado: 'aprobada' | 'rechazada',
    currentUser: JwtPayload,
  ) {
    const devolucion = await this.prisma.devolucion.findUnique({
      where: { id },
    });
    if (!devolucion)
      throw new NotFoundException(`Devolución ${id} no encontrada`);

    let codigoQr: string | undefined;

    if (estado === 'aprobada') {
      const payload = JSON.stringify({
        devolucionId: id,
        pedidoId: devolucion.idPedido,
        usuarioId: devolucion.idUsuario,
        aprobadoPor: currentUser.sub,
        timestamp: new Date().toISOString(),
      });
      codigoQr = await QRCode.toDataURL(payload);
    }

    return this.prisma.devolucion.update({
      where: { id },
      data: {
        estado,
        ...(codigoQr ? { codigoQr } : {}),
      },
    });
  }

  // ── CRUD base (sin cambios) ────────────────────────────────────────────────
  create(createDevolucioneDto: CreateDevolucioneDto) {
    return this.prisma.devolucion.create({ data: createDevolucioneDto as any });
  }

  findAll() {
    return this.prisma.devolucion.findMany({
      include: {
        pedido: { select: { id: true, numeroOrden: true, fechaOrden: true } },
        usuario: {
          select: { id: true, nombre: true, apellido: true, correo: true },
        },
      },
      orderBy: { pedido: { fechaOrden: 'desc' } },
    });
  }

  findOne(id: string) {
    return this.prisma.devolucion.findUnique({
      where: { id },
      include: {
        pedido: { select: { id: true, numeroOrden: true, fechaOrden: true } },
        usuario: {
          select: { id: true, nombre: true, apellido: true, correo: true },
        },
      },
    });
  }

  update(id: string, updateDevolucioneDto: UpdateDevolucioneDto) {
    return this.prisma.devolucion.update({
      where: { id },
      data: updateDevolucioneDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.devolucion.delete({ where: { id } });
  }
}
