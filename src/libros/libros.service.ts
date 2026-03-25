import { Injectable } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibrosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createLibroDto: CreateLibroDto) {
    const { idGeneros, ...libroData } = createLibroDto;
    const uniqueGenreIds = Array.from(new Set(idGeneros));

    return this.prisma.libro.create({
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
    });
  }

  findAll() {
    return this.prisma.libro.findMany({
      include: {
        generos: {
          include: {
            genero: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.libro.findUnique({
      where: { id },
      include: {
        generos: {
          include: {
            genero: true,
          },
        },
      },
    });
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

    return this.prisma.libro.update({
      where: { id },
      data,
      include: {
        generos: {
          include: {
            genero: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.libro.delete({ where: { id } });
  }
}
