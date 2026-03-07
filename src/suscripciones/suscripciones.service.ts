import { Injectable } from '@nestjs/common';
import { CreateSuscripcioneDto } from './dto/create-suscripcione.dto';
import { UpdateSuscripcioneDto } from './dto/update-suscripcione.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuscripcionesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSuscripcioneDto: CreateSuscripcioneDto) {
    return this.prisma.suscripcion.create({ data: createSuscripcioneDto as any });
  }

  findAll() {
    return this.prisma.suscripcion.findMany();
  }

  findOne(id: number) {
    return this.prisma.suscripcion.findUnique({ where: { id } });
  }

  update(id: number, updateSuscripcioneDto: UpdateSuscripcioneDto) {
    return this.prisma.suscripcion.update({ where: { id }, data: updateSuscripcioneDto as any });
  }

  remove(id: number) {
    return this.prisma.suscripcion.delete({ where: { id } });
  }
}
