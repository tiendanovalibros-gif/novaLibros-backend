import { Module } from '@nestjs/common';
import { EstadosPedidoService } from './estados-pedido.service';
import { EstadosPedidoController } from './estados-pedido.controller';

@Module({
  controllers: [EstadosPedidoController],
  providers: [EstadosPedidoService],
})
export class EstadosPedidoModule {}
