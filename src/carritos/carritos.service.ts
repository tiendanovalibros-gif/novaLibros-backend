import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AddItemCarritoDto } from './dto/add-item-carrito.dto';
import { CheckoutCarritoDto } from './dto/checkout-carrito.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../utils';

@Injectable()
export class CarritosService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(currentUser: JwtPayload) {
    const carrito = await this.getOrCreateMine(currentUser);

    return this.prisma.carritoCompras.findUnique({
      where: { id: carrito.id },
      include: {
        detalles: {
          include: {
            libro: {
              select: {
                id: true,
                titulo: true,
                imagenPortada: true,
                isbn: true,
                precio: true,
                estado: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });
  }

  async addItemToMine(currentUser: JwtPayload, dto: AddItemCarritoDto) {
    if (currentUser.rol !== 'cliente') {
      throw new ForbiddenException(
        'Solo los clientes pueden agregar productos al carrito',
      );
    }

    if (dto.cantidad <= 0) {
      throw new BadRequestException('La cantidad a agregar debe ser mayor a 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const carrito = await this.getOrCreateMine(currentUser, tx);

      const libro = await tx.libro.findUnique({
        where: { id: dto.idLibro },
        select: { id: true, precio: true },
      });

      if (!libro) {
        throw new NotFoundException('El libro no existe');
      }

      const detalleExistente = await tx.detalleCarrito.findFirst({
        where: {
          idCarrito: carrito.id,
          idLibro: dto.idLibro,
        },
      });

      const disponibilidadInventario = await tx.inventario.aggregate({
        where: {
          idLibro: dto.idLibro,
        },
        _sum: {
          cantidadDisponible: true,
        },
      });

      const cantidadDisponible =
        disponibilidadInventario._sum.cantidadDisponible ?? 0;
      const cantidadActualEnCarrito = detalleExistente?.cantidad ?? 0;
      const cantidadTotalSolicitada = cantidadActualEnCarrito + dto.cantidad;

      if (cantidadDisponible < cantidadTotalSolicitada) {
        throw new BadRequestException('No hay existencias disponibles');
      }

      if (detalleExistente) {
        await tx.detalleCarrito.update({
          where: { id: detalleExistente.id },
          data: {
            cantidad: {
              increment: dto.cantidad,
            },
            precioUnitario: libro.precio,
          },
        });
      } else {
        await tx.detalleCarrito.create({
          data: {
            idCarrito: carrito.id,
            idLibro: dto.idLibro,
            cantidad: dto.cantidad,
            precioUnitario: libro.precio,
          },
        });
      }

      await tx.carritoCompras.update({
        where: { id: carrito.id },
        data: {
          fechaActualizacion: new Date(),
        },
      });

      return tx.carritoCompras.findUnique({
        where: { id: carrito.id },
        include: {
          detalles: {
            include: {
              libro: {
                select: {
                  id: true,
                  titulo: true,
                  imagenPortada: true,
                  isbn: true,
                  precio: true,
                  estado: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async removeItemFromMine(currentUser: JwtPayload, idDetalle: number) {
    if (currentUser.rol !== 'cliente') {
      throw new ForbiddenException(
        'Solo los clientes pueden modificar productos del carrito',
      );
    }

    if (!Number.isInteger(idDetalle) || idDetalle <= 0) {
      throw new BadRequestException('El id del detalle es inválido');
    }

    return this.prisma.$transaction(async (tx) => {
      const carrito = await this.getOrCreateMine(currentUser, tx);

      const detalle = await tx.detalleCarrito.findUnique({
        where: { id: idDetalle },
      });

      if (!detalle || detalle.idCarrito !== carrito.id) {
        throw new NotFoundException('El producto no existe en tu carrito');
      }

      await tx.detalleCarrito.delete({
        where: { id: idDetalle },
      });

      await tx.carritoCompras.update({
        where: { id: carrito.id },
        data: {
          fechaActualizacion: new Date(),
        },
      });

      return tx.carritoCompras.findUnique({
        where: { id: carrito.id },
        include: {
          detalles: {
            include: {
              libro: {
                select: {
                  id: true,
                  titulo: true,
                  imagenPortada: true,
                  isbn: true,
                  precio: true,
                  estado: true,
                },
              },
            },
            orderBy: {
              id: 'desc',
            },
          },
        },
      });
    });
  }

  async updateItemQuantityFromMine(
    currentUser: JwtPayload,
    idDetalle: number,
    cantidad: number,
  ) {
    if (currentUser.rol !== 'cliente') {
      throw new ForbiddenException(
        'Solo los clientes pueden modificar productos del carrito',
      );
    }

    if (!Number.isInteger(idDetalle) || idDetalle <= 0) {
      throw new BadRequestException('El id del detalle es inválido');
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser un entero mayor a 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const carrito = await this.getOrCreateMine(currentUser, tx);

      const detalle = await tx.detalleCarrito.findUnique({
        where: { id: idDetalle },
      });

      if (!detalle || detalle.idCarrito !== carrito.id) {
        throw new NotFoundException('El producto no existe en tu carrito');
      }

      const disponibilidadInventario = await tx.inventario.aggregate({
        where: {
          idLibro: detalle.idLibro,
        },
        _sum: {
          cantidadDisponible: true,
        },
      });

      const cantidadDisponible =
        disponibilidadInventario._sum.cantidadDisponible ?? 0;

      if (cantidad > cantidadDisponible) {
        throw new BadRequestException('No hay existencias disponibles');
      }

      await tx.detalleCarrito.update({
        where: { id: idDetalle },
        data: {
          cantidad,
        },
      });

      await tx.carritoCompras.update({
        where: { id: carrito.id },
        data: {
          fechaActualizacion: new Date(),
        },
      });

      return tx.carritoCompras.findUnique({
        where: { id: carrito.id },
        include: {
          detalles: {
            include: {
              libro: {
                select: {
                  id: true,
                  titulo: true,
                  imagenPortada: true,
                  isbn: true,
                  precio: true,
                  estado: true,
                },
              },
            },
            orderBy: {
              id: 'desc',
            },
          },
        },
      });
    });
  }

  create(createCarritoDto: CreateCarritoDto) {
    return this.prisma.carritoCompras.create({ data: createCarritoDto as any });
  }

  findAll() {
    return this.prisma.carritoCompras.findMany();
  }

  findOne(id: number) {
    return this.prisma.carritoCompras.findUnique({ where: { id } });
  }

  update(id: number, updateCarritoDto: UpdateCarritoDto) {
    return this.prisma.carritoCompras.update({
      where: { id },
      data: updateCarritoDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.carritoCompras.delete({ where: { id } });
  }

  async checkoutFromMine(currentUser: JwtPayload, dto: CheckoutCarritoDto) {
    if (currentUser.rol !== 'cliente') {
      throw new ForbiddenException('Solo los clientes pueden comprar');
    }

    return this.prisma.$transaction(async (tx) => {
      const carrito = await this.getOrCreateMine(currentUser, tx);

      const detalles = await tx.detalleCarrito.findMany({
        where: { idCarrito: carrito.id },
        include: {
          libro: {
            select: { id: true, titulo: true },
          },
        },
      });

      if (detalles.length === 0) {
        throw new BadRequestException('El carrito esta vacio');
      }

      const libroIds = detalles.map((detalle) => detalle.idLibro);

      const disponibilidad = await tx.inventario.groupBy({
        by: ['idLibro'],
        where: { idLibro: { in: libroIds } },
        _sum: { cantidadDisponible: true },
      });

      const disponiblesPorLibro = new Map<string, number>();
      for (const item of disponibilidad) {
        disponiblesPorLibro.set(
          item.idLibro,
          item._sum.cantidadDisponible ?? 0,
        );
      }

      for (const detalle of detalles) {
        const disponible = disponiblesPorLibro.get(detalle.idLibro) ?? 0;
        if (detalle.cantidad > disponible) {
          throw new BadRequestException(
            `No hay existencias disponibles para ${detalle.libro.titulo}`,
          );
        }
      }

      const montoTotal = detalles.reduce(
        (acc, item) => acc + Number(item.precioUnitario) * item.cantidad,
        0,
      );

      if (montoTotal <= 0) {
        throw new BadRequestException('El monto total es invalido');
      }

      const saldoActual = await tx.saldoUsuario.findFirst({
        where: { idUsuario: currentUser.sub },
      });

      const saldoDisponible = saldoActual
        ? Number(saldoActual.saldoDisponible)
        : 0;

      if (saldoDisponible < montoTotal) {
        throw new BadRequestException('Saldo insuficiente');
      }

      const usuario = await tx.usuario.findUnique({
        where: { id: currentUser.sub },
        select: { direccion: true },
      });

      const metodoEntrega = dto.metodoEntrega ?? 'domicilio';
      const direccionEntrega =
        dto.direccionEntrega ?? usuario?.direccion ?? null;

      const pedido = await tx.pedido.create({
        data: {
          idUsuario: currentUser.sub,
          numeroOrden: this.generateNumeroOrden(),
          fechaOrden: new Date(),
          montoTotal,
          metodoEntrega,
          direccionEntrega,
        },
      });

      await tx.itemPedido.createMany({
        data: detalles.map((detalle) => ({
          idPedido: pedido.id,
          idLibro: detalle.idLibro,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
        })),
      });

      await tx.estadoPedido.create({
        data: {
          idPedido: pedido.id,
          estado: 'en_preparacion',
          fechaCambio: new Date(),
        },
      });

      for (const detalle of detalles) {
        await this.decrementarInventarioLibro(
          tx,
          detalle.idLibro,
          detalle.cantidad,
        );
      }

      if (!saldoActual) {
        throw new BadRequestException('Saldo insuficiente');
      }

      const saldoActualizado = await tx.saldoUsuario.update({
        where: { id: saldoActual.id },
        data: { saldoDisponible: { decrement: montoTotal } },
      });

      await tx.movimientoSaldo.create({
        data: {
          idUsuario: currentUser.sub,
          tipoMovimiento: 'compra',
          monto: montoTotal,
          idPedido: pedido.id,
        },
      });

      await tx.detalleCarrito.deleteMany({
        where: { idCarrito: carrito.id },
      });

      await tx.carritoCompras.update({
        where: { id: carrito.id },
        data: { fechaActualizacion: new Date() },
      });

      return {
        pedidoId: pedido.id,
        numeroOrden: pedido.numeroOrden,
        montoTotal: pedido.montoTotal,
        saldoDisponible: saldoActualizado.saldoDisponible,
      };
    });
  }

  private async getOrCreateMine(
    currentUser: JwtPayload,
    tx?: PrismaService | any,
  ) {
    const db = tx ?? this.prisma;

    const carritoExistente = await db.carritoCompras.findFirst({
      where: {
        idUsuario: currentUser.sub,
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (carritoExistente) {
      return carritoExistente;
    }

    const ahora = new Date();
    return db.carritoCompras.create({
      data: {
        idUsuario: currentUser.sub,
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      },
    });
  }

  private generateNumeroOrden() {
    const fecha = new Date();
    const ymd = fecha.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `ORD-${ymd}-${rand}`;
  }

  private async decrementarInventarioLibro(
    tx: PrismaService | any,
    idLibro: string,
    cantidad: number,
  ) {
    if (cantidad <= 0) {
      return;
    }

    const inventarios = await tx.inventario.findMany({
      where: {
        idLibro,
        cantidadDisponible: { gt: 0 },
      },
      orderBy: { cantidadDisponible: 'desc' },
      select: { id: true, cantidadDisponible: true },
    });

    let restante = cantidad;

    for (const inventario of inventarios) {
      if (restante <= 0) break;
      const tomar = Math.min(inventario.cantidadDisponible, restante);

      const actualizado = await tx.inventario.updateMany({
        where: {
          id: inventario.id,
          cantidadDisponible: { gte: tomar },
        },
        data: {
          cantidadDisponible: { decrement: tomar },
          fechaActualizacion: new Date(),
        },
      });

      if (actualizado.count === 0) {
        throw new ConflictException('Existencias insuficientes');
      }

      restante -= tomar;
    }

    if (restante > 0) {
      throw new BadRequestException('No hay existencias disponibles');
    }
  }
}
