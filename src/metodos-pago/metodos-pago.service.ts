import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetodosPagoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMetodosPagoDto: CreateMetodosPagoDto) {
    return this.prisma.metodoPago.create({ data: createMetodosPagoDto as any });
  }

  createForUsuario(idUsuario: string, dto: CreateMetodosPagoDto) {
    return this.prisma.metodoPago.create({
      data: { ...(dto as any), idUsuario },
    });
  }

  findAll() {
    return this.prisma.metodoPago.findMany();
  }

  findByUsuario(idUsuario: string) {
    return this.prisma.metodoPago.findMany({
      where: { idUsuario },
      orderBy: { id: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.metodoPago.findUnique({ where: { id } });
  }

  update(id: number, updateMetodosPagoDto: UpdateMetodosPagoDto) {
    return this.prisma.metodoPago.update({ where: { id }, data: updateMetodosPagoDto as any });
  }

  async removeIfOwner(id: number, idUsuario: string) {
    const metodo = await this.prisma.metodoPago.findUnique({ where: { id } });
    if (!metodo || metodo.idUsuario !== idUsuario) {
      throw new ForbiddenException('No tienes permiso para eliminar este metodo de pago');
    }
    return this.prisma.metodoPago.delete({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.metodoPago.delete({ where: { id } });
  }
}
