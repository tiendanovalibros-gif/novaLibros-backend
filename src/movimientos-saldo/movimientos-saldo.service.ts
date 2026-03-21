import { Injectable } from '@nestjs/common';
import { CreateMovimientosSaldoDto } from './dto/create-movimientos-saldo.dto';
import { UpdateMovimientosSaldoDto } from './dto/update-movimientos-saldo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovimientosSaldoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMovimientosSaldoDto: CreateMovimientosSaldoDto) {
    return this.prisma.movimientoSaldo.create({ data: createMovimientosSaldoDto as any });
  }

  findAll() {
    return this.prisma.movimientoSaldo.findMany();
  }

  findOne(id: number) {
    return this.prisma.movimientoSaldo.findUnique({ where: { id } });
  }

  update(id: number, updateMovimientosSaldoDto: UpdateMovimientosSaldoDto) {
    return this.prisma.movimientoSaldo.update({ where: { id }, data: updateMovimientosSaldoDto as any });
  }

  remove(id: number) {
    return this.prisma.movimientoSaldo.delete({ where: { id } });
  }
}
