import { Injectable } from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarritosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCarritoDto: CreateCarritoDto) {
    return this.prisma.carritoCompras.create({ data: createCarritoDto as any });
  }

  findAll() {
    return this.prisma.carritoCompras.findMany();
  }

  findOne(id: number) {
    return this.prisma.carritoCompras.findUnique({ where: { id } });
  }

  update(id: number, updateCarritoDto: UpdateCarritoDto) {
    return this.prisma.carritoCompras.update({ where: { id }, data: updateCarritoDto as any });
  }

  remove(id: number) {
    return this.prisma.carritoCompras.delete({ where: { id } });
  }
}
