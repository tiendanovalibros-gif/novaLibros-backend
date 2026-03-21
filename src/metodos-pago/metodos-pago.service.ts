import { Injectable } from '@nestjs/common';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetodosPagoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMetodosPagoDto: CreateMetodosPagoDto) {
    return this.prisma.metodoPago.create({ data: createMetodosPagoDto as any });
  }

  findAll() {
    return this.prisma.metodoPago.findMany();
  }

  findOne(id: number) {
    return this.prisma.metodoPago.findUnique({ where: { id } });
  }

  update(id: number, updateMetodosPagoDto: UpdateMetodosPagoDto) {
    return this.prisma.metodoPago.update({ where: { id }, data: updateMetodosPagoDto as any });
  }

  remove(id: number) {
    return this.prisma.metodoPago.delete({ where: { id } });
  }
}
