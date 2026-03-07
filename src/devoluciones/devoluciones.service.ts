import { Injectable } from '@nestjs/common';
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DevolucionesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDevolucioneDto: CreateDevolucioneDto) {
    return this.prisma.devolucion.create({ data: createDevolucioneDto as any });
  }

  findAll() {
    return this.prisma.devolucion.findMany();
  }

  findOne(id: string) {
    return this.prisma.devolucion.findUnique({ where: { id } });
  }

  update(id: string, updateDevolucioneDto: UpdateDevolucioneDto) {
    return this.prisma.devolucion.update({ where: { id }, data: updateDevolucioneDto as any });
  }

  remove(id: string) {
    return this.prisma.devolucion.delete({ where: { id } });
  }
}
