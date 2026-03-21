import { Injectable } from '@nestjs/common';
import { CreateRegistrosBusquedaDto } from './dto/create-registros-busqueda.dto';
import { UpdateRegistrosBusquedaDto } from './dto/update-registros-busqueda.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrosBusquedaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRegistrosBusquedaDto: CreateRegistrosBusquedaDto) {
    return this.prisma.registroBusqueda.create({ data: createRegistrosBusquedaDto as any });
  }

  findAll() {
    return this.prisma.registroBusqueda.findMany();
  }

  findOne(id: number) {
    return this.prisma.registroBusqueda.findUnique({ where: { id } });
  }

  update(id: number, updateRegistrosBusquedaDto: UpdateRegistrosBusquedaDto) {
    return this.prisma.registroBusqueda.update({ where: { id }, data: updateRegistrosBusquedaDto as any });
  }

  remove(id: number) {
    return this.prisma.registroBusqueda.delete({ where: { id } });
  }
}
