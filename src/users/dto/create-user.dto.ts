export class CreateUserDto {
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  correo: string;
  contrasenaHash: string;
  direccion?: string;
  telefono?: string;
  rol: string;
  estadoCuenta: boolean;
}
