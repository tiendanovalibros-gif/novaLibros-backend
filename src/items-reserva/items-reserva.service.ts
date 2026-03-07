import { Injectable } from '@nestjs/common';
import { CreateItemsReservaDto } from './dto/create-items-reserva.dto';
import { UpdateItemsReservaDto } from './dto/update-items-reserva.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsReservaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createItemsReservaDto: CreateItemsReservaDto) {
    return this.prisma.itemReserva.create({ data: createItemsReservaDto as any });
  }

  findAll() {
    return this.prisma.itemReserva.findMany();
  }

  findOne(id: number) {
    return this.prisma.itemReserva.findUnique({ where: { id } });
  }

  update(id: number, updateItemsReservaDto: UpdateItemsReservaDto) {
    return this.prisma.itemReserva.update({ where: { id }, data: updateItemsReservaDto as any });
  }

  remove(id: number) {
    return this.prisma.itemReserva.delete({ where: { id } });
  }
}
