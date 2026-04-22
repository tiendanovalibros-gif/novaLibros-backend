import { Injectable } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibrosService {
  constructor(private readonly prisma: PrismaService) {}

  private withGeneroCompatibility(libro: any) {
    const idGeneros = Array.isArray(libro?.generos)
      ? libro.generos
          .map((rel: any) => rel?.idGenero)
          .filter((id: unknown) => typeof id === 'number')
      : [];

    return {
      ...libro,
      // Compatibilidad temporal con frontend que aun consume un unico genero
      idGeneros,
      idGenero: idGeneros[0] ?? 0,
    };
  }

  search(params: {
    q?: string;
    idAutor?: number;
    generoIds?: number[];
    anoMin?: number;
    anoMax?: number;
  }) {
    const andFilters: any[] = [];

    if (params.q) {
      const terms = params.q.split(/\s+/).filter((term) => term.length > 0);
      for (const term of terms) {
        andFilters.push({
          OR: [
            { titulo: { contains: term, mode: 'insensitive' } },
            { descripcion: { contains: term, mode: 'insensitive' } },
            { isbn: { contains: term, mode: 'insensitive' } },
            { autor: { nombre: { contains: term, mode: 'insensitive' } } },
            { editorial: { nombre: { contains: term, mode: 'insensitive' } } },
            {
              generos: {
                some: {
                  genero: { nombre: { contains: term, mode: 'insensitive' } },
                },
              },
            },
          ],
        });
      }
    }

    if (params.idAutor !== undefined) {
      andFilters.push({ idAutor: params.idAutor });
    }

    if (params.generoIds && params.generoIds.length > 0) {
      andFilters.push({
        generos: { some: { idGenero: { in: params.generoIds } } },
      });
    }

    if (params.anoMin !== undefined || params.anoMax !== undefined) {
      andFilters.push({
        anoPublicacion: {
          gte: params.anoMin,
          lte: params.anoMax,
        },
      });
    }

    return this.prisma.libro
      .findMany({
        where: andFilters.length ? { AND: andFilters } : undefined,
        include: {
          generos: {
            include: {
              genero: true,
            },
          },
        },
      })
      .then((libros) =>
        libros.map((libro) => this.withGeneroCompatibility(libro)),
      );
  }

  create(createLibroDto: CreateLibroDto) {
    const { idGeneros, ...libroData } = createLibroDto;
    const uniqueGenreIds = Array.from(new Set(idGeneros));

    return this.prisma.libro
      .create({
        data: {
          ...libroData,
          generos: {
            create: uniqueGenreIds.map((idGenero) => ({ idGenero })),
          },
        } as any,
        include: {
          generos: {
            include: {
              genero: true,
            },
          },
        },
      })
      .then((libro) => this.withGeneroCompatibility(libro));
  }

  findAll() {
    return this.prisma.libro
      .findMany({
        include: {
          generos: {
            include: {
              genero: true,
            },
          },
        },
      })
      .then((libros) =>
        libros.map((libro) => this.withGeneroCompatibility(libro)),
      );
  }

  findOne(id: string) {
    return this.prisma.libro
      .findUnique({
        where: { id },
        include: {
          generos: {
            include: {
              genero: true,
            },
          },
        },
      })
      .then((libro) => (libro ? this.withGeneroCompatibility(libro) : libro));
  }

  update(id: string, updateLibroDto: UpdateLibroDto) {
    const { idGeneros, ...libroData } = updateLibroDto as any;
    const data: any = { ...libroData };

    if (Array.isArray(idGeneros)) {
      const uniqueGenreIds = Array.from(new Set(idGeneros));
      data.generos = {
        deleteMany: {},
        create: uniqueGenreIds.map((idGenero: number) => ({ idGenero })),
      };
    }

    return this.prisma.libro
      .update({
        where: { id },
        data,
        include: {
          generos: {
            include: {
              genero: true,
            },
          },
        },
      })
      .then((libro) => this.withGeneroCompatibility(libro));
  }

  remove(id: string) {
    return this.prisma.libro.delete({ where: { id } });
  }
}
