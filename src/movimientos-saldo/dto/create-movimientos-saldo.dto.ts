export class CreateMovimientosSaldoDto {
  idUsuario: string;
  tipoMovimiento: string;
  monto: number;
  idPedido?: string;
  idMetodoPago?: number;
}
