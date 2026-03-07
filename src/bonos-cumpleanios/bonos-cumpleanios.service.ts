import { Injectable } from '@nestjs/common';
import { CreateBonosCumpleanioDto } from './dto/create-bonos-cumpleanio.dto';
import { UpdateBonosCumpleanioDto } from './dto/update-bonos-cumpleanio.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BonosCumpleaniosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBonosCumpleanioDto: CreateBonosCumpleanioDto) {
    return this.prisma.bonoCumpleanios.create({ data: createBonosCumpleanioDto as any });
  }

  findAll() {
    return this.prisma.bonoCumpleanios.findMany();
  }

  findOne(id: number) {
    return this.prisma.bonoCumpleanios.findUnique({ where: { id } });
  }

  update(id: number, updateBonosCumpleanioDto: UpdateBonosCumpleanioDto) {
    return this.prisma.bonoCumpleanios.update({ where: { id }, data: updateBonosCumpleanioDto as any });
  }

  remove(id: number) {
    return this.prisma.bonoCumpleanios.delete({ where: { id } });
  }
}
