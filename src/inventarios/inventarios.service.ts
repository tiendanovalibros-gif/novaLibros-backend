import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { AddLibrosPorGeneroDto } from './dto/add-libros-por-genero.dto';
import { UpdateCantidadLibroDto } from './dto/update-cantidad-libro.dto';
import { BloquearLibrosDto } from './dto/bloquear-libros.dto';
import { AddExistenciasLibroDto } from './dto/add-existencias-libro.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findLibrosAgotados() {
    const libros = await this.prisma.libro.findMany({
      include: {
        autor: {
          select: {
            id: true,
            nombre: true,
          },
        },
        editorial: {
          select: {
            id: true,
            nombre: true,
          },
        },
        inventarios: {
          select: {
            cantidadDisponible: true,
            cantidadBloqueada: true,
            fechaActualizacion: true,
          },
        },
      },
    });

    return libros
      .map((libro) => {
        const totalDisponible = libro.inventarios.reduce(
          (acc, inv) => acc + inv.cantidadDisponible,
          0,
        );
        const totalBloqueada = libro.inventarios.reduce(
          (acc, inv) => acc + inv.cantidadBloqueada,
          0,
        );

        const ultimaActualizacion = libro.inventarios.reduce<Date>(
          (maxFecha, inv) =>
            inv.fechaActualizacion > maxFecha
              ? inv.fechaActualizacion
              : maxFecha,
          new Date(0),
        );

        return {
          idLibro: libro.id,
          titulo: libro.titulo,
          isbn: libro.isbn,
          estado: libro.estado,
          idAutor: libro.idAutor,
          idEditorial: libro.idEditorial,
          autor: libro.autor,
          editorial: libro.editorial,
          imagenPortada: libro.imagenPortada,
          totalDisponible,
          totalBloqueada,
          tiendasAfectadas: libro.inventarios.length,
          ultimaActualizacion,
        };
      })
      .filter((libro) => libro.totalDisponible === 0)
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  async findLibrosAgotadosAdmin() {
    const inventarios = await this.prisma.inventario.findMany({
      include: {
        tienda: {
          select: {
            id: true,
            nombre: true,
          },
        },
        libro: {
          include: {
            autor: {
              select: {
                id: true,
                nombre: true,
              },
            },
            editorial: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: [{ idLibro: 'asc' }, { idTienda: 'asc' }],
    });

    const resumenPorLibro = new Map<string, any>();

    for (const inventario of inventarios) {
      const existente = resumenPorLibro.get(inventario.idLibro);

      if (!existente) {
        resumenPorLibro.set(inventario.idLibro, {
          idLibro: inventario.idLibro,
          titulo: inventario.libro.titulo,
          isbn: inventario.libro.isbn,
          autor: inventario.libro.autor,
          editorial: inventario.libro.editorial,
          totalDisponible: inventario.cantidadDisponible,
          totalBloqueada: inventario.cantidadBloqueada,
          ultimaActualizacion: inventario.fechaActualizacion,
          inventarios: [
            {
              idInventario: inventario.id,
              idTienda: inventario.idTienda,
              nombreTienda: inventario.tienda.nombre,
              cantidadDisponible: inventario.cantidadDisponible,
              cantidadBloqueada: inventario.cantidadBloqueada,
              fechaActualizacion: inventario.fechaActualizacion,
            },
          ],
        });
        continue;
      }

      existente.totalDisponible += inventario.cantidadDisponible;
      existente.totalBloqueada += inventario.cantidadBloqueada;
      existente.inventarios.push({
        idInventario: inventario.id,
        idTienda: inventario.idTienda,
        nombreTienda: inventario.tienda.nombre,
        cantidadDisponible: inventario.cantidadDisponible,
        cantidadBloqueada: inventario.cantidadBloqueada,
        fechaActualizacion: inventario.fechaActualizacion,
      });

      if (inventario.fechaActualizacion > existente.ultimaActualizacion) {
        existente.ultimaActualizacion = inventario.fechaActualizacion;
      }
    }

    return Array.from(resumenPorLibro.values())
      .filter((libro) => libro.totalDisponible === 0)
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  async create(createInventarioDto: CreateInventarioDto) {
    const existingInventario = await this.prisma.inventario.findFirst({
      where: {
        idLibro: createInventarioDto.idLibro,
        idTienda: createInventarioDto.idTienda,
      },
    });

    if (existingInventario) {
      throw new ConflictException(
        'Ya existe inventario para ese libro en la tienda indicada',
      );
    }

    return this.prisma.inventario.create({ data: createInventarioDto as any });
  }

  async addLibrosPorGenero(
    idTienda: number,
    idGenero: number,
    addLibrosPorGeneroDto: AddLibrosPorGeneroDto,
  ) {
    if (addLibrosPorGeneroDto.cantidadDisponible < 0) {
      throw new BadRequestException(
        'La cantidad disponible no puede ser negativa',
      );
    }

    if ((addLibrosPorGeneroDto.cantidadBloqueada ?? 0) < 0) {
      throw new BadRequestException(
        'La cantidad bloqueada no puede ser negativa',
      );
    }

    const libros = await this.prisma.libro.findMany({
      where: {
        generos: {
          some: {
            idGenero,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (libros.length === 0) {
      throw new NotFoundException('No hay libros para el genero indicado');
    }

    const cantidadBloqueadaInicial =
      addLibrosPorGeneroDto.cantidadBloqueada ?? 0;

    return this.prisma.$transaction(async (tx) => {
      let creados = 0;
      let actualizados = 0;

      for (const libro of libros) {
        const inventarios = await tx.inventario.findMany({
          where: {
            idLibro: libro.id,
            idTienda,
          },
          orderBy: {
            id: 'asc',
          },
        });

        if (inventarios.length > 1) {
          throw new ConflictException(
            `Hay inventario duplicado para el libro ${libro.id} en la tienda ${idTienda}`,
          );
        }

        if (inventarios.length === 1) {
          await tx.inventario.update({
            where: {
              id: inventarios[0].id,
            },
            data: {
              cantidadDisponible: {
                increment: addLibrosPorGeneroDto.cantidadDisponible,
              },
              cantidadBloqueada: {
                increment: cantidadBloqueadaInicial,
              },
              fechaActualizacion: new Date(),
            },
          });

          actualizados += 1;
          continue;
        }

        await tx.inventario.create({
          data: {
            idLibro: libro.id,
            idTienda,
            cantidadDisponible: addLibrosPorGeneroDto.cantidadDisponible,
            cantidadBloqueada: cantidadBloqueadaInicial,
            fechaActualizacion: new Date(),
          },
        });

        creados += 1;
      }

      return {
        idTienda,
        idGenero,
        totalProcesados: libros.length,
        creados,
        actualizados,
      };
    });
  }

  async findByTienda(idTienda: number) {
    const inventarios = await this.prisma.inventario.findMany({
      where: { idTienda },
      include: {
        libro: {
          select: {
            id: true,
            titulo: true,
            isbn: true,
            imagenPortada: true,
            precio: true,
            estado: true,
            autor: { select: { id: true, nombre: true } },
            editorial: { select: { id: true, nombre: true } },
          },
        },
      },
      orderBy: { libro: { titulo: 'asc' } },
    });

    const totalDisponible = inventarios.reduce(
      (acc, inv) => acc + inv.cantidadDisponible,
      0,
    );
    const totalBloqueada = inventarios.reduce(
      (acc, inv) => acc + inv.cantidadBloqueada,
      0,
    );
    const librosAgotados = inventarios.filter(
      (inv) => inv.cantidadDisponible === 0,
    ).length;

    return {
      resumen: {
        totalItems: inventarios.length,
        totalDisponible,
        totalBloqueada,
        librosAgotados,
      },
      inventarios: inventarios.map((inv) => ({
        id: inv.id,
        idLibro: inv.idLibro,
        idTienda: inv.idTienda,
        cantidadDisponible: inv.cantidadDisponible,
        cantidadBloqueada: inv.cantidadBloqueada,
        fechaActualizacion: inv.fechaActualizacion,
        libro: inv.libro,
      })),
    };
  }

  findAll() {
    return this.prisma.inventario.findMany();
  }

  findOne(id: number) {
    return this.prisma.inventario.findUnique({ where: { id } });
  }

  update(id: number, updateInventarioDto: UpdateInventarioDto) {
    return this.prisma.inventario.update({
      where: { id },
      data: updateInventarioDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.inventario.delete({ where: { id } });
  }

  async updateCantidadLibro(
    idTienda: number,
    idLibro: string,
    updateCantidadLibroDto: UpdateCantidadLibroDto,
  ) {
    if (updateCantidadLibroDto.cantidadDisponible < 0) {
      throw new BadRequestException(
        'La cantidad disponible no puede ser negativa',
      );
    }

    const inventario = await this.getInventarioUnicoPorLibroYTienda(
      idLibro,
      idTienda,
    );

    if (!inventario) {
      throw new NotFoundException(
        'No existe inventario para ese libro en la tienda indicada',
      );
    }

    if (
      updateCantidadLibroDto.cantidadDisponible < inventario.cantidadBloqueada
    ) {
      throw new BadRequestException(
        'La cantidad disponible no puede ser menor que la cantidad bloqueada',
      );
    }

    return this.prisma.inventario.update({
      where: {
        id: inventario.id,
      },
      data: {
        cantidadDisponible: updateCantidadLibroDto.cantidadDisponible,
        fechaActualizacion: new Date(),
      },
    });
  }

  async marcarLibroAgotado(idTienda: number, idLibro: string) {
    const inventario = await this.getInventarioUnicoPorLibroYTienda(
      idLibro,
      idTienda,
    );

    if (!inventario) {
      throw new NotFoundException(
        'No existe inventario para ese libro en la tienda indicada',
      );
    }

    return this.prisma.inventario.update({
      where: {
        id: inventario.id,
      },
      data: {
        cantidadDisponible: 0,
        fechaActualizacion: new Date(),
      },
    });
  }

  async bloquearLibros(
    idTienda: number,
    idLibro: string,
    bloquearLibrosDto: BloquearLibrosDto,
  ) {
    if (bloquearLibrosDto.cantidadABloquear <= 0) {
      throw new BadRequestException(
        'La cantidad a bloquear debe ser mayor a 0',
      );
    }

    const inventario = await this.getInventarioUnicoPorLibroYTienda(
      idLibro,
      idTienda,
    );

    if (!inventario) {
      throw new NotFoundException(
        'No existe inventario para ese libro en la tienda indicada',
      );
    }

    if (inventario.cantidadDisponible < bloquearLibrosDto.cantidadABloquear) {
      throw new BadRequestException(
        'No hay suficientes libros disponibles para bloquear',
      );
    }

    return this.prisma.inventario.update({
      where: {
        id: inventario.id,
      },
      data: {
        cantidadDisponible: {
          decrement: bloquearLibrosDto.cantidadABloquear,
        },
        cantidadBloqueada: {
          increment: bloquearLibrosDto.cantidadABloquear,
        },
        fechaActualizacion: new Date(),
      },
    });
  }

  async addExistenciasLibro(
    idTienda: number,
    idLibro: string,
    addExistenciasLibroDto: AddExistenciasLibroDto,
  ) {
    if (addExistenciasLibroDto.cantidadAAgregar <= 0) {
      throw new BadRequestException('La cantidad a agregar debe ser mayor a 0');
    }

    const inventario = await this.getInventarioUnicoPorLibroYTienda(
      idLibro,
      idTienda,
    );

    if (!inventario) {
      throw new NotFoundException(
        'No existe inventario para ese libro en la tienda indicada',
      );
    }

    return this.prisma.inventario.update({
      where: {
        id: inventario.id,
      },
      data: {
        cantidadDisponible: {
          increment: addExistenciasLibroDto.cantidadAAgregar,
        },
        fechaActualizacion: new Date(),
      },
    });
  }

  private async getInventarioUnicoPorLibroYTienda(
    idLibro: string,
    idTienda: number,
  ) {
    const inventarios = await this.prisma.inventario.findMany({
      where: {
        idLibro,
        idTienda,
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (inventarios.length > 1) {
      throw new ConflictException(
        'Existen registros duplicados de inventario para ese libro y tienda',
      );
    }

    return inventarios[0] ?? null;
  }
}
