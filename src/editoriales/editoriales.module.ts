import { Module } from '@nestjs/common';
import { EditorialesService } from './editoriales.service';
import { EditorialesController } from './editoriales.controller';

@Module({
  controllers: [EditorialesController],
  providers: [EditorialesService],
})
export class EditorialesModule {}
