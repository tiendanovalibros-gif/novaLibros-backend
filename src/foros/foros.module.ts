import { Module } from '@nestjs/common';
import { ForosService } from './foros.service';
import { ForosController } from './foros.controller';

@Module({
  controllers: [ForosController],
  providers: [ForosService],
})
export class ForosModule {}
