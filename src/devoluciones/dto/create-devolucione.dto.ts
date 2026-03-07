export class CreateDevolucioneDto {
  idPedido: string;
  idUsuario: string;
  razon: string;
  descripcion?: string;
  estado: string;
  codigoQr?: string;
}
