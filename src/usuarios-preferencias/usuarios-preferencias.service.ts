import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUsuariosPreferenciaDto } from './dto/create-usuarios-preferencia.dto';
import { UpdateUsuariosPreferenciaDto } from './dto/update-usuarios-preferencia.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosPreferenciasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuariosPreferenciaDto: CreateUsuariosPreferenciaDto) {
    const { idUsuario, idPreferenciaLiteraria } = createUsuariosPreferenciaDto;

    const existing = await this.prisma.usuarioPreferencia.findUnique({
      where: {
        idUsuario_idPreferenciaLiteraria: {
          idUsuario,
          idPreferenciaLiteraria,
        },
      },
    });

    if (existing) {
      throw new ConflictException('El usuario ya tiene asignada esta preferencia');
    }

    return this.prisma.usuarioPreferencia.create({
      data: createUsuariosPreferenciaDto,
    });
  }

  findAll() {
    return this.prisma.usuarioPreferencia.findMany({
      include: {
        usuario: true,
        preferenciaLiteraria: true,
      },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.usuarioPreferencia.findUnique({
      where: { id },
      include: {
        usuario: true,
        preferenciaLiteraria: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Asociación con ID ${id} no encontrada`);
    }
    return item;
  }

  update(id: number, updateUsuariosPreferenciaDto: UpdateUsuariosPreferenciaDto) {
    return this.prisma.usuarioPreferencia.update({
      where: { id },
      data: updateUsuariosPreferenciaDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.usuarioPreferencia.delete({
      where: { id },
    });
  }
}
