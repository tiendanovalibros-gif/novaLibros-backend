import { Injectable } from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TiendasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTiendaDto: CreateTiendaDto) {
    return this.prisma.tienda.create({ data: createTiendaDto });
  }

  findAll() {
    return this.prisma.tienda.findMany();
  }

  findOne(id: number) {
    return this.prisma.tienda.findUnique({ where: { id } });
  }

  update(id: number, updateTiendaDto: UpdateTiendaDto) {
    return this.prisma.tienda.update({ where: { id }, data: updateTiendaDto });
  }

  remove(id: number) {
    return this.prisma.tienda.delete({ where: { id } });
  }
}
