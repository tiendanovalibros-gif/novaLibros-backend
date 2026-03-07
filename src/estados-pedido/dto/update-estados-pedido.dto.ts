import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadosPedidoDto } from './create-estados-pedido.dto';

export class UpdateEstadosPedidoDto extends PartialType(CreateEstadosPedidoDto) {}
