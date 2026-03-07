export class CreateFacturaDto {
  idPedido: string;
  idUsuario: string;
  montoSubtotal: number;
  iva: number;
  montoTotal: number;
}
