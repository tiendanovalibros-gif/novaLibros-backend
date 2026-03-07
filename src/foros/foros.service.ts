import { Injectable } from '@nestjs/common';
import { CreateForoDto } from './dto/create-foro.dto';
import { UpdateForoDto } from './dto/update-foro.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createForoDto: CreateForoDto) {
    return this.prisma.foro.create({ data: createForoDto as any });
  }

  findAll() {
    return this.prisma.foro.findMany();
  }

  findOne(id: number) {
    return this.prisma.foro.findUnique({ where: { id } });
  }

  update(id: number, updateForoDto: UpdateForoDto) {
    return this.prisma.foro.update({ where: { id }, data: updateForoDto as any });
  }

  remove(id: number) {
    return this.prisma.foro.delete({ where: { id } });
  }
}
