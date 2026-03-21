import { Injectable } from '@nestjs/common';
import { CreateItemsPedidoDto } from './dto/create-items-pedido.dto';
import { UpdateItemsPedidoDto } from './dto/update-items-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsPedidoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createItemsPedidoDto: CreateItemsPedidoDto) {
    return this.prisma.itemPedido.create({ data: createItemsPedidoDto as any });
  }

  findAll() {
    return this.prisma.itemPedido.findMany();
  }

  findOne(id: number) {
    return this.prisma.itemPedido.findUnique({ where: { id } });
  }

  update(id: number, updateItemsPedidoDto: UpdateItemsPedidoDto) {
    return this.prisma.itemPedido.update({ where: { id }, data: updateItemsPedidoDto as any });
  }

  remove(id: number) {
    return this.prisma.itemPedido.delete({ where: { id } });
  }
}
