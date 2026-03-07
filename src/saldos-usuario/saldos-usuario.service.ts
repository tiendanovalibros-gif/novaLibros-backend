import { Injectable } from '@nestjs/common';
import { CreateSaldosUsuarioDto } from './dto/create-saldos-usuario.dto';
import { UpdateSaldosUsuarioDto } from './dto/update-saldos-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaldosUsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSaldosUsuarioDto: CreateSaldosUsuarioDto) {
    return this.prisma.saldoUsuario.create({ data: createSaldosUsuarioDto as any });
  }

  findAll() {
    return this.prisma.saldoUsuario.findMany();
  }

  findOne(id: number) {
    return this.prisma.saldoUsuario.findUnique({ where: { id } });
  }

  update(id: number, updateSaldosUsuarioDto: UpdateSaldosUsuarioDto) {
    return this.prisma.saldoUsuario.update({ where: { id }, data: updateSaldosUsuarioDto as any });
  }

  remove(id: number) {
    return this.prisma.saldoUsuario.delete({ where: { id } });
  }
}
