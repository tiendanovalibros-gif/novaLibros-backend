import { Injectable } from '@nestjs/common';
import { CreateAutoreDto } from './dto/create-autore.dto';
import { UpdateAutoreDto } from './dto/update-autore.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AutoresService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAutoreDto: CreateAutoreDto) {
    return this.prisma.autor.create({ data: createAutoreDto });
  }

  findAll() {
    return this.prisma.autor.findMany();
  }

  findOne(id: number) {
    return this.prisma.autor.findUnique({ where: { id } });
  }

  update(id: number, updateAutoreDto: UpdateAutoreDto) {
    return this.prisma.autor.update({ where: { id }, data: updateAutoreDto });
  }

  remove(id: number) {
    return this.prisma.autor.delete({ where: { id } });
  }
}
