import { Injectable } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventariosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createInventarioDto: CreateInventarioDto) {
    return this.prisma.inventario.create({ data: createInventarioDto as any });
  }

  findAll() {
    return this.prisma.inventario.findMany();
  }

  findOne(id: number) {
    return this.prisma.inventario.findUnique({ where: { id } });
  }

  update(id: number, updateInventarioDto: UpdateInventarioDto) {
    return this.prisma.inventario.update({ where: { id }, data: updateInventarioDto as any });
  }

  remove(id: number) {
    return this.prisma.inventario.delete({ where: { id } });
  }
}
