import { Module } from '@nestjs/common';
import { PreferenciasLiterariasService } from './preferencias-literarias.service';
import { PreferenciasLiterariasController } from './preferencias-literarias.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PreferenciasLiterariasController],
  providers: [PreferenciasLiterariasService],
})
export class PreferenciasLiterariasModule {}
