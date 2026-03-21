import { Injectable } from '@nestjs/common';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MensajesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMensajeDto: CreateMensajeDto) {
    return this.prisma.mensaje.create({ data: createMensajeDto as any });
  }

  findAll() {
    return this.prisma.mensaje.findMany();
  }

  findOne(id: string) {
    return this.prisma.mensaje.findUnique({ where: { id } });
  }

  update(id: string, updateMensajeDto: UpdateMensajeDto) {
    return this.prisma.mensaje.update({ where: { id }, data: updateMensajeDto as any });
  }

  remove(id: string) {
    return this.prisma.mensaje.delete({ where: { id } });
  }
}
