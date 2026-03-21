import { Injectable } from '@nestjs/common';
import { CreateEstadosPedidoDto } from './dto/create-estados-pedido.dto';
import { UpdateEstadosPedidoDto } from './dto/update-estados-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstadosPedidoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEstadosPedidoDto: CreateEstadosPedidoDto) {
    return this.prisma.estadoPedido.create({ data: createEstadosPedidoDto as any });
  }

  findAll() {
    return this.prisma.estadoPedido.findMany();
  }

  findOne(id: number) {
    return this.prisma.estadoPedido.findUnique({ where: { id } });
  }

  update(id: number, updateEstadosPedidoDto: UpdateEstadosPedidoDto) {
    return this.prisma.estadoPedido.update({ where: { id }, data: updateEstadosPedidoDto as any });
  }

  remove(id: number) {
    return this.prisma.estadoPedido.delete({ where: { id } });
  }
}
