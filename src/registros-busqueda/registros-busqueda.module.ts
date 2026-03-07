import { Module } from '@nestjs/common';
import { RegistrosBusquedaService } from './registros-busqueda.service';
import { RegistrosBusquedaController } from './registros-busqueda.controller';

@Module({
  controllers: [RegistrosBusquedaController],
  providers: [RegistrosBusquedaService],
})
export class RegistrosBusquedaModule {}
