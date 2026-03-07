import { Module } from '@nestjs/common';
import { ItemsReservaService } from './items-reserva.service';
import { ItemsReservaController } from './items-reserva.controller';

@Module({
  controllers: [ItemsReservaController],
  providers: [ItemsReservaService],
})
export class ItemsReservaModule {}
