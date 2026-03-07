export class CreatePedidoDto {
  idUsuario: string;
  numeroOrden: string;
  fechaOrden: string;
  montoTotal: number;
  metodoEntrega: string;
  idTienda?: number;
  direccionEntrega?: string;
}
