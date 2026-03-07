import { Module } from '@nestjs/common';
import { DetallesCarritoService } from './detalles-carrito.service';
import { DetallesCarritoController } from './detalles-carrito.controller';

@Module({
  controllers: [DetallesCarritoController],
  providers: [DetallesCarritoService],
})
export class DetallesCarritoModule {}
