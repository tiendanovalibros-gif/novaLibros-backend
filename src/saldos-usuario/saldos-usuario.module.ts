import { Module } from '@nestjs/common';
import { SaldosUsuarioService } from './saldos-usuario.service';
import { SaldosUsuarioController } from './saldos-usuario.controller';

@Module({
  controllers: [SaldosUsuarioController],
  providers: [SaldosUsuarioService],
})
export class SaldosUsuarioModule {}
