import { Injectable } from '@nestjs/common';
import { CreateDetallesCarritoDto } from './dto/create-detalles-carrito.dto';
import { UpdateDetallesCarritoDto } from './dto/update-detalles-carrito.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DetallesCarritoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDetallesCarritoDto: CreateDetallesCarritoDto) {
    return this.prisma.detalleCarrito.create({ data: createDetallesCarritoDto as any });
  }

  findAll() {
    return this.prisma.detalleCarrito.findMany();
  }

  findOne(id: number) {
    return this.prisma.detalleCarrito.findUnique({ where: { id } });
  }

  update(id: number, updateDetallesCarritoDto: UpdateDetallesCarritoDto) {
    return this.prisma.detalleCarrito.update({ where: { id }, data: updateDetallesCarritoDto as any });
  }

  remove(id: number) {
    return this.prisma.detalleCarrito.delete({ where: { id } });
  }
}
