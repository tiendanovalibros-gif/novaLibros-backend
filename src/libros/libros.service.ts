import { Injectable } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibrosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createLibroDto: CreateLibroDto) {
    return this.prisma.libro.create({ data: createLibroDto as any });
  }

  findAll() {
    return this.prisma.libro.findMany();
  }

  findOne(id: string) {
    return this.prisma.libro.findUnique({ where: { id } });
  }

  update(id: string, updateLibroDto: UpdateLibroDto) {
    return this.prisma.libro.update({ where: { id }, data: updateLibroDto as any });
  }

  remove(id: string) {
    return this.prisma.libro.delete({ where: { id } });
  }
}
