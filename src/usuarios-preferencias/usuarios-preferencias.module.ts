import { Module } from '@nestjs/common';
import { UsuariosPreferenciasService } from './usuarios-preferencias.service';
import { UsuariosPreferenciasController } from './usuarios-preferencias.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsuariosPreferenciasController],
  providers: [UsuariosPreferenciasService],
})
export class UsuariosPreferenciasModule {}
