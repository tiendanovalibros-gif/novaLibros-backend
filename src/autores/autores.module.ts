import { Module } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { AutoresController } from './autores.controller';

@Module({
  controllers: [AutoresController],
  providers: [AutoresService],
})
export class AutoresModule {}
