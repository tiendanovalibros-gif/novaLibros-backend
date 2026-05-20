import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MetodoEntrega } from '@prisma/client';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AddItemCarritoDto } from './dto/add-item-carrito.dto';
import { CheckoutCarritoDto } from './dto/checkout-carrito.dto';
import { OpcionesRecogidaQueryDto } from './dto/opciones-recogida-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { haversineKm } from '../common/utils/geo.util';
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

  async opcionesRecogida(
    currentUser: JwtPayload,
    query: OpcionesRecogidaQueryDto,
  ) {
    if (currentUser.rol !== 'cliente') {
      throw new ForbiddenException('Solo los clientes pueden ver opciones de recogida');
    }

    const carrito = await this.getOrCreateMine(currentUser);
    const detalles = await this.prisma.detalleCarrito.findMany({
      where: { idCarrito: carrito.id },
      select: { idLibro: true, cantidad: true },
    });

    if (detalles.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    const libroIds = detalles.map((d) => d.idLibro);

    const [tiendas, inventarios] = await Promise.all([
      this.prisma.tienda.findMany({
        include: { ciudad: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.inventario.findMany({
        where: { idLibro: { in: libroIds } },
        select: { idTienda: true, idLibro: true, cantidadDisponible: true },
      }),
    ]);

    const stockPorTiendaYLibro = new Map<string, number>();
    for (const inv of inventarios) {
      stockPorTiendaYLibro.set(`${inv.idTienda}:${inv.idLibro}`, inv.cantidadDisponible);
    }

    const tieneCoords =
      typeof query.lat === 'number' &&
      typeof query.lng === 'number' &&
      Number.isFinite(query.lat) &&
      Number.isFinite(query.lng);

    const opciones = tiendas.map((tienda) => {
      const faltantes: Array<{ idLibro: string; solicitado: number; disponible: number }> = [];

      for (const { idLibro, cantidad } of detalles) {
        const disponible = stockPorTiendaYLibro.get(`${tienda.id}:${idLibro}`) ?? 0;
        if (disponible < cantidad) {
          faltantes.push({ idLibro, solicitado: cantidad, disponible });
        }
      }

      const distanciaKm =
        tieneCoords
          ? haversineKm(
              query.lat!,
              query.lng!,
              Number(tienda.latitud),
              Number(tienda.longitud),
            )
          : null;

      return {
        id: tienda.id,
        nombre: tienda.nombre,
        direccion: tienda.direccion,
        direccionNormalizada: tienda.direccionNormalizada,
        ciudad: tienda.ciudad?.nombre ?? null,
        latitud: Number(tienda.latitud),
        longitud: Number(tienda.longitud),
        distanciaKm,
        puedeCompletarCarrito: faltantes.length === 0,
        faltantes,
      };
    });

    opciones.sort((a, b) => {
      if (a.puedeCompletarCarrito !== b.puedeCompletarCarrito) {
        return a.puedeCompletarCarrito ? -1 : 1;
      }
      if (a.distanciaKm === null && b.distanciaKm === null) return 0;
      if (a.distanciaKm === null) return 1;
      if (b.distanciaKm === null) return -1;
      return a.distanciaKm - b.distanciaKm;
    });

    return opciones;
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
      const tienda = await tx.tienda.findUnique({ where: { id: dto.idTienda } });
      if (!tienda) {
        throw new NotFoundException(`Tienda con id ${dto.idTienda} no encontrada`);
      }

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

      const inventariosTienda = await tx.inventario.findMany({
        where: { idTienda: dto.idTienda, idLibro: { in: libroIds } },
        select: { idLibro: true, cantidadDisponible: true },
      });

      const disponiblePorLibro = new Map<string, number>();
      for (const inv of inventariosTienda) {
        disponiblePorLibro.set(inv.idLibro, inv.cantidadDisponible);
      }

      for (const detalle of detalles) {
        const disponible = disponiblePorLibro.get(detalle.idLibro) ?? 0;
        if (detalle.cantidad > disponible) {
          throw new BadRequestException(
            `La tienda "${tienda.nombre}" no tiene existencias suficientes para "${detalle.libro.titulo}" (disponible: ${disponible}, solicitado: ${detalle.cantidad})`,
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

      const pedido = await tx.pedido.create({
        data: {
          idUsuario: currentUser.sub,
          numeroOrden: this.generateNumeroOrden(),
          fechaOrden: new Date(),
          montoTotal,
          metodoEntrega: MetodoEntrega.tienda,
          idTienda: dto.idTienda,
          direccionEntrega: null,
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
          dto.idTienda,
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
        idTienda: pedido.idTienda,
        nombreTienda: tienda.nombre,
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
    idTienda: number,
  ) {
    if (cantidad <= 0) {
      return;
    }

    const actualizado = await tx.inventario.updateMany({
      where: {
        idLibro,
        idTienda,
        cantidadDisponible: { gte: cantidad },
      },
      data: {
        cantidadDisponible: { decrement: cantidad },
        fechaActualizacion: new Date(),
      },
    });

    if (actualizado.count === 0) {
      throw new ConflictException(
        `Existencias insuficientes en la tienda para el libro ${idLibro}`,
      );
    }
  }
}
