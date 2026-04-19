import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AddItemCarritoDto } from './dto/add-item-carrito.dto';
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
}
