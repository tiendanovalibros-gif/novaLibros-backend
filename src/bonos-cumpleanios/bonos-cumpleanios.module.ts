import { Module } from '@nestjs/common';
import { BonosCumpleaniosService } from './bonos-cumpleanios.service';
import { BonosCumpleaniosController } from './bonos-cumpleanios.controller';

@Module({
  controllers: [BonosCumpleaniosController],
  providers: [BonosCumpleaniosService],
})
export class BonosCumpleaniosModule {}
