import { Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReservaDto: CreateReservaDto) {
    return this.prisma.reserva.create({ data: createReservaDto as any });
  }

  findAll() {
    return this.prisma.reserva.findMany();
  }

  findOne(id: string) {
    return this.prisma.reserva.findUnique({ where: { id } });
  }

  update(id: string, updateReservaDto: UpdateReservaDto) {
    return this.prisma.reserva.update({ where: { id }, data: updateReservaDto as any });
  }

  remove(id: string) {
    return this.prisma.reserva.delete({ where: { id } });
  }
}
