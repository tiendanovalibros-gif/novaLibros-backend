import { Module } from '@nestjs/common';
import { ItemsPedidoService } from './items-pedido.service';
import { ItemsPedidoController } from './items-pedido.controller';

@Module({
  controllers: [ItemsPedidoController],
  providers: [ItemsPedidoService],
})
export class ItemsPedidoModule {}
