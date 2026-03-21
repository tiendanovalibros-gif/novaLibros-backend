import { Injectable } from '@nestjs/common';
import { CreateEditorialeDto } from './dto/create-editoriale.dto';
import { UpdateEditorialeDto } from './dto/update-editoriale.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EditorialesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEditorialeDto: CreateEditorialeDto) {
    return this.prisma.editorial.create({ data: createEditorialeDto });
  }

  findAll() {
    return this.prisma.editorial.findMany();
  }

  findOne(id: number) {
    return this.prisma.editorial.findUnique({ where: { id } });
  }

  update(id: number, updateEditorialeDto: UpdateEditorialeDto) {
    return this.prisma.editorial.update({ where: { id }, data: updateEditorialeDto });
  }

  remove(id: number) {
    return this.prisma.editorial.delete({ where: { id } });
  }
}
