import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSaldosUsuarioDto } from './dto/create-saldos-usuario.dto';
import { UpdateSaldosUsuarioDto } from './dto/update-saldos-usuario.dto';
import { RecargarSaldoDto } from './dto/recargar-saldo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaldosUsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSaldosUsuarioDto: CreateSaldosUsuarioDto) {
    return this.prisma.saldoUsuario.create({
      data: createSaldosUsuarioDto as any,
    });
  }

  findAll() {
    return this.prisma.saldoUsuario.findMany();
  }

  async findByUsuario(idUsuario: string) {
    const saldo = await this.prisma.saldoUsuario.findFirst({
      where: { idUsuario },
    });
    return saldo ?? { id: null, idUsuario, saldoDisponible: 0 };
  }

  findOne(id: number) {
    return this.prisma.saldoUsuario.findUnique({ where: { id } });
  }

  update(id: number, updateSaldosUsuarioDto: UpdateSaldosUsuarioDto) {
    return this.prisma.saldoUsuario.update({
      where: { id },
      data: updateSaldosUsuarioDto as any,
    });
  }

  async recargar(idUsuario: string, dto: RecargarSaldoDto) {
    const metodo = await this.prisma.metodoPago.findFirst({
      where: { id: dto.idMetodoPago, idUsuario },
    });
    if (!metodo) {
      throw new ForbiddenException('Metodo de pago no valido');
    }

    const lastFour = metodo.numeroEnmascarado.replace(/\D/g, '').slice(-4);
    if (lastFour === '4343') {
      throw new BadRequestException('Pago rechazado por la pasarela sandbox');
    }
    if (lastFour !== '4242') {
      throw new BadRequestException('Sandbox: tarjeta no habilitada');
    }

    const saldoActual = await this.prisma.saldoUsuario.findFirst({
      where: { idUsuario },
    });
    let saldo;
    if (saldoActual) {
      saldo = await this.prisma.saldoUsuario.update({
        where: { id: saldoActual.id },
        data: { saldoDisponible: { increment: dto.monto } },
      });
    } else {
      saldo = await this.prisma.saldoUsuario.create({
        data: { idUsuario, saldoDisponible: dto.monto },
      });
    }

    await this.prisma.movimientoSaldo.create({
      data: {
        idUsuario,
        tipoMovimiento: 'recarga',
        monto: dto.monto,
        idMetodoPago: dto.idMetodoPago,
      },
    });

    return saldo;
  }

  remove(id: number) {
    return this.prisma.saldoUsuario.delete({ where: { id } });
  }
}
