import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePreferenciasLiterariaDto } from './dto/create-preferencias-literaria.dto';
import { UpdatePreferenciasLiterariaDto } from './dto/update-preferencias-literaria.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PreferenciasLiterariasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPreferenciasLiterariaDto: CreatePreferenciasLiterariaDto) {
    const existing = await this.prisma.preferenciaLiteraria.findUnique({
      where: { nombre: createPreferenciasLiterariaDto.nombre },
    });

    if (existing) {
      throw new ConflictException('La preferencia literaria ya existe');
    }

    return this.prisma.preferenciaLiteraria.create({
      data: createPreferenciasLiterariaDto,
    });
  }

  findAll() {
    return this.prisma.preferenciaLiteraria.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.preferenciaLiteraria.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Preferencia literaria con ID ${id} no encontrada`);
    }
    return item;
  }

  update(id: number, updatePreferenciasLiterariaDto: UpdatePreferenciasLiterariaDto) {
    return this.prisma.preferenciaLiteraria.update({
      where: { id },
      data: updatePreferenciasLiterariaDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.preferenciaLiteraria.delete({
      where: { id },
    });
  }
}
