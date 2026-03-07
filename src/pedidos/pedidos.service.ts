import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPedidoDto: CreatePedidoDto) {
    return this.prisma.pedido.create({ data: createPedidoDto as any });
  }

  findAll() {
    return this.prisma.pedido.findMany();
  }

  findOne(id: string) {
    return this.prisma.pedido.findUnique({ where: { id } });
  }

  update(id: string, updatePedidoDto: UpdatePedidoDto) {
    return this.prisma.pedido.update({ where: { id }, data: updatePedidoDto as any });
  }

  remove(id: string) {
    return this.prisma.pedido.delete({ where: { id } });
  }
}
