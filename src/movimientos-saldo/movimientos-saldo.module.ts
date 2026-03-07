import { Module } from '@nestjs/common';
import { MovimientosSaldoService } from './movimientos-saldo.service';
import { MovimientosSaldoController } from './movimientos-saldo.controller';

@Module({
  controllers: [MovimientosSaldoController],
  providers: [MovimientosSaldoService],
})
export class MovimientosSaldoModule {}
