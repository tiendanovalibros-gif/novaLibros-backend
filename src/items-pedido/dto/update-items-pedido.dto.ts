import { PartialType } from '@nestjs/mapped-types';
import { CreateItemsPedidoDto } from './create-items-pedido.dto';

export class UpdateItemsPedidoDto extends PartialType(CreateItemsPedidoDto) {}
