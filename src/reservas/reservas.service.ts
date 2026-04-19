import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../utils';

@Injectable()
export class ReservasService {
  private static readonly MAX_LIBROS_MISMO_TIPO = 3;
  private static readonly MAX_LIBROS_TOTALES = 5;
  private static readonly DURACION_RESERVA_HORAS = 24;
  private static readonly INTERVALO_EXPIRACION_MS = 60 * 1000;
  private expirationTimer: NodeJS.Timeout | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    void this.expirarReservasYLiberarInventario(this.prisma).catch(
      () => undefined,
    );

    this.expirationTimer = setInterval(() => {
      void this.expirarReservasYLiberarInventario(this.prisma).catch(
        () => undefined,
      );
    }, ReservasService.INTERVALO_EXPIRACION_MS);
  }

  onModuleDestroy() {
    if (this.expirationTimer) {
      clearInterval(this.expirationTimer);
      this.expirationTimer = null;
    }
  }

  async create(createReservaDto: CreateReservaDto, currentUser: JwtPayload) {
    if (currentUser.rol !== 'cliente') {
      throw new ForbiddenException(
        'Solo los clientes pueden realizar reservas',
      );
    }

    if (createReservaDto.cantidad <= 0) {
      throw new BadRequestException(
        'La cantidad a reservar debe ser mayor a 0',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await this.expirarReservasYLiberarInventario(tx);

      const libro = await tx.libro.findUnique({
        where: { id: createReservaDto.idLibro },
        select: { id: true },
      });

      if (!libro) {
        throw new NotFoundException('El libro no existe');
      }

      const reservasActivas = await tx.reserva.findMany({
        where: {
          idUsuario: currentUser.sub,
          estado: 'activa',
          horaExpiracion: {
            gt: new Date(),
          },
        },
        include: {
          itemsReserva: {
            select: {
              idLibro: true,
              cantidad: true,
            },
          },
        },
      });

      const totalLibrosActivos = reservasActivas.reduce(
        (total, reserva) =>
          total +
          reserva.itemsReserva.reduce(
            (subTotal, item) => subTotal + item.cantidad,
            0,
          ),
        0,
      );

      const totalMismoLibro = reservasActivas.reduce(
        (total, reserva) =>
          total +
          reserva.itemsReserva
            .filter((item) => item.idLibro === createReservaDto.idLibro)
            .reduce((subTotal, item) => subTotal + item.cantidad, 0),
        0,
      );

      if (
        totalMismoLibro + createReservaDto.cantidad >
        ReservasService.MAX_LIBROS_MISMO_TIPO
      ) {
        throw new BadRequestException(
          `No puedes reservar mas de ${ReservasService.MAX_LIBROS_MISMO_TIPO} ejemplares del mismo libro`,
        );
      }

      if (
        totalLibrosActivos + createReservaDto.cantidad >
        ReservasService.MAX_LIBROS_TOTALES
      ) {
        throw new BadRequestException(
          `No puedes tener mas de ${ReservasService.MAX_LIBROS_TOTALES} libros reservados en total`,
        );
      }

      const inventariosDisponibles = await tx.inventario.findMany({
        where: {
          idLibro: createReservaDto.idLibro,
          cantidadDisponible: {
            gt: 0,
          },
        },
        orderBy: [
          {
            cantidadDisponible: 'desc',
          },
          {
            id: 'asc',
          },
        ],
      });

      const totalDisponible = inventariosDisponibles.reduce(
        (total, inventario) => total + inventario.cantidadDisponible,
        0,
      );

      if (totalDisponible < createReservaDto.cantidad) {
        throw new BadRequestException(
          'No hay inventario suficiente para reservar',
        );
      }

      let cantidadPendienteBloquear = createReservaDto.cantidad;
      for (const inventario of inventariosDisponibles) {
        if (cantidadPendienteBloquear <= 0) {
          break;
        }

        const cantidadABloquear = Math.min(
          inventario.cantidadDisponible,
          cantidadPendienteBloquear,
        );

        await tx.inventario.update({
          where: { id: inventario.id },
          data: {
            cantidadDisponible: {
              decrement: cantidadABloquear,
            },
            cantidadBloqueada: {
              increment: cantidadABloquear,
            },
            fechaActualizacion: new Date(),
          },
        });

        cantidadPendienteBloquear -= cantidadABloquear;
      }

      const ahora = new Date();
      const horaExpiracion = new Date(
        ahora.getTime() +
          ReservasService.DURACION_RESERVA_HORAS * 60 * 60 * 1000,
      );

      return tx.reserva.create({
        data: {
          idUsuario: currentUser.sub,
          horaCreacion: ahora,
          horaExpiracion,
          estado: 'activa',
          itemsReserva: {
            create: {
              idLibro: createReservaDto.idLibro,
              cantidad: createReservaDto.cantidad,
            },
          },
        },
        include: {
          itemsReserva: true,
        },
      });
    });
  }

  async findAll() {
    await this.expirarReservasYLiberarInventario(this.prisma);
    return this.prisma.reserva.findMany({
      include: {
        itemsReserva: true,
      },
      orderBy: {
        horaCreacion: 'desc',
      },
    });
  }

  async findMine(currentUser: JwtPayload) {
    await this.expirarReservasYLiberarInventario(this.prisma);
    return this.prisma.reserva.findMany({
      where: {
        idUsuario: currentUser.sub,
      },
      include: {
        itemsReserva: {
          include: {
            libro: {
              select: {
                id: true,
                titulo: true,
                imagenPortada: true,
                isbn: true,
              },
            },
          },
        },
      },
      orderBy: {
        horaCreacion: 'desc',
      },
    });
  }

  async findOne(id: string, currentUser: JwtPayload) {
    await this.expirarReservasYLiberarInventario(this.prisma);

    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: {
        itemsReserva: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const puedeVer =
      currentUser.rol === 'root' ||
      currentUser.rol === 'administrador' ||
      reserva.idUsuario === currentUser.sub;

    if (!puedeVer) {
      throw new ForbiddenException('No autorizado para ver esta reserva');
    }

    return reserva;
  }

  async update(id: string, updateReservaDto: UpdateReservaDto) {
    return this.prisma.reserva.update({
      where: { id },
      data: updateReservaDto as any,
    });
  }

  async cancel(id: string, currentUser: JwtPayload) {
    return this.prisma.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: { id },
        include: {
          itemsReserva: true,
        },
      });

      if (!reserva) {
        throw new NotFoundException('Reserva no encontrada');
      }

      const puedeCancelar =
        currentUser.rol === 'root' ||
        currentUser.rol === 'administrador' ||
        reserva.idUsuario === currentUser.sub;

      if (!puedeCancelar) {
        throw new ForbiddenException(
          'No autorizado para cancelar esta reserva',
        );
      }

      if (reserva.estado !== 'activa') {
        return reserva;
      }

      await this.liberarInventarioDeItems(tx, reserva.itemsReserva);

      return tx.reserva.update({
        where: { id },
        data: {
          estado: 'cancelada',
        },
        include: {
          itemsReserva: true,
        },
      });
    });
  }

  async remove(id: string) {
    return this.prisma.reserva.delete({ where: { id } });
  }

  private async expirarReservasYLiberarInventario(tx: PrismaService | any) {
    const ahora = new Date();
    const reservasExpiradas = await tx.reserva.findMany({
      where: {
        estado: 'activa',
        horaExpiracion: {
          lte: ahora,
        },
      },
      include: {
        itemsReserva: true,
      },
    });

    if (reservasExpiradas.length === 0) {
      return;
    }

    for (const reserva of reservasExpiradas) {
      await this.liberarInventarioDeItems(tx, reserva.itemsReserva);

      await tx.reserva.update({
        where: { id: reserva.id },
        data: {
          estado: 'expirada',
        },
      });
    }
  }

  private async liberarInventarioDeItems(
    tx: PrismaService | any,
    itemsReserva: Array<{ idLibro: string; cantidad: number }>,
  ) {
    for (const item of itemsReserva) {
      let cantidadPendienteLiberar = item.cantidad;

      const inventariosBloqueados = await tx.inventario.findMany({
        where: {
          idLibro: item.idLibro,
          cantidadBloqueada: {
            gt: 0,
          },
        },
        orderBy: [
          {
            cantidadBloqueada: 'desc',
          },
          {
            id: 'asc',
          },
        ],
      });

      for (const inventario of inventariosBloqueados) {
        if (cantidadPendienteLiberar <= 0) {
          break;
        }

        const cantidadALiberar = Math.min(
          inventario.cantidadBloqueada,
          cantidadPendienteLiberar,
        );

        await tx.inventario.update({
          where: { id: inventario.id },
          data: {
            cantidadDisponible: {
              increment: cantidadALiberar,
            },
            cantidadBloqueada: {
              decrement: cantidadALiberar,
            },
            fechaActualizacion: new Date(),
          },
        });

        cantidadPendienteLiberar -= cantidadALiberar;
      }
    }
  }
}
