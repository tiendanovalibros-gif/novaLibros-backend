# Diagrama de Clases — NovaLibros Backend

> Diagrama unificado generado a partir del análisis completo del código fuente del proyecto NestJS.
>
> **Patrón arquitectónico**: Controller → Service → PrismaORM → PostgreSQL

---

```mermaid
classDiagram
    direction TB

    %% ╔══════════════════════════════════════════════╗
    %% ║              ENUMERACIONES                    ║
    %% ╚══════════════════════════════════════════════╝

    class RolUsuario {
        <<Enumeration>>
        root
        administrador
        cliente
        visitante
    }

    class EstadoLibro {
        <<Enumeration>>
        nuevo
        usado
    }

    class EstadoReserva {
        <<Enumeration>>
        activa
        expirada
        cancelada
        convertida
    }

    class MetodoEntrega {
        <<Enumeration>>
        domicilio
        tienda
    }

    class EstadoPedidoVal {
        <<Enumeration>>
        en_preparacion
        enviado
        entregado
    }

    class EstadoDevolucion {
        <<Enumeration>>
        solicitada
        aprobada
        rechazada
    }

    class TipoTarjeta {
        <<Enumeration>>
        credito
        debito
    }

    class TipoMovimiento {
        <<Enumeration>>
        recarga
        compra
        devolucion
        bono
    }

    %% ╔══════════════════════════════════════════════╗
    %% ║         ENTIDADES DE DOMINIO (Prisma)         ║
    %% ╚══════════════════════════════════════════════╝

    class Usuario {
        +UUID id
        +String dni
        +String nombre
        +String apellido
        +Date fechaNacimiento
        +String correo
        +String contrasenaHash
        +String? direccion
        +String? telefono
        +RolUsuario rol
        +Boolean estadoCuenta
        +DateTime fechaRegistro
    }

    class Autor {
        +Int id
        +String nombre
    }

    class Genero {
        +Int id
        +String nombre
    }

    class Editorial {
        +Int id
        +String nombre
    }

    class Tienda {
        +Int id
        +String nombre
        +String direccion
        +Decimal latitud
        +Decimal longitud
    }

    class Libro {
        +UUID id
        +String titulo
        +Int idAutor
        +Int idEditorial
        +Int anoPublicacion
        +Decimal precio
        +String isbn
        +String idioma
        +String? descripcion
        +String? imagenPortada
        +EstadoLibro estado
    }

    class LibroGenero {
        +UUID idLibro
        +Int idGenero
    }

    class Inventario {
        +Int id
        +UUID idLibro
        +Int idTienda
        +Int cantidadDisponible
        +Int cantidadBloqueada
        +DateTime fechaActualizacion
    }

    class Reserva {
        +UUID id
        +UUID idUsuario
        +DateTime horaCreacion
        +DateTime horaExpiracion
        +EstadoReserva estado
    }

    class ItemReserva {
        +Int id
        +UUID idReserva
        +UUID idLibro
        +Int cantidad
    }

    class CarritoCompras {
        +Int id
        +UUID idUsuario
        +DateTime fechaCreacion
        +DateTime fechaActualizacion
    }

    class DetalleCarrito {
        +Int id
        +Int idCarrito
        +UUID idLibro
        +Int cantidad
        +Decimal precioUnitario
    }

    class Pedido {
        +UUID id
        +UUID idUsuario
        +String numeroOrden
        +DateTime fechaOrden
        +Decimal montoTotal
        +MetodoEntrega metodoEntrega
        +Int? idTienda
        +String? direccionEntrega
    }

    class ItemPedido {
        +Int id
        +UUID idPedido
        +UUID idLibro
        +Int cantidad
        +Decimal precioUnitario
    }

    class EstadoPedido {
        +Int id
        +UUID idPedido
        +EstadoPedidoVal estado
        +DateTime fechaCambio
    }

    class Devolucion {
        +UUID id
        +UUID idPedido
        +UUID idUsuario
        +String razon
        +String? descripcion
        +EstadoDevolucion estado
        +String? codigoQr
    }

    class FacturaElectronica {
        +UUID id
        +UUID idPedido
        +UUID idUsuario
        +Decimal montoSubtotal
        +Decimal iva
        +Decimal montoTotal
    }

    class Suscripcion {
        +Int id
        +UUID idUsuario
        +Boolean activa
    }

    class Foro {
        +Int id
        +String titulo
        +DateTime fechaCreacion
    }

    class Mensaje {
        +UUID id
        +Int idForo
        +UUID idRemitente
        +String contenido
        +DateTime fechaHora
    }

    class MetodoPago {
        +Int id
        +UUID idUsuario
        +TipoTarjeta tipo
        +String numeroEnmascarado
        +String titular
    }

    class SaldoUsuario {
        +Int id
        +UUID idUsuario
        +Decimal saldoDisponible
    }

    class MovimientoSaldo {
        +Int id
        +UUID idUsuario
        +TipoMovimiento tipoMovimiento
        +Decimal monto
        +UUID? idPedido
        +Int? idMetodoPago
    }

    class RegistroBusqueda {
        +Int id
        +UUID idUsuario
        +String criterio
    }

    class BonoCumpleanios {
        +Int id
        +UUID idUsuario
        +Decimal porcentajeDescuento
        +Date fechaVigencia
    }

    class PreferenciaLiteraria {
        +Int id
        +String nombre
    }

    class UsuarioPreferencia {
        +Int id
        +UUID idUsuario
        +Int idPreferenciaLiteraria
    }

    %% ─── Relaciones entre Entidades ───

    Usuario --> RolUsuario : rol
    Libro --> EstadoLibro : estado
    Reserva --> EstadoReserva : estado
    Pedido --> MetodoEntrega : metodoEntrega
    EstadoPedido --> EstadoPedidoVal : estado
    Devolucion --> EstadoDevolucion : estado
    MetodoPago --> TipoTarjeta : tipo
    MovimientoSaldo --> TipoMovimiento : tipoMovimiento

    Autor "1" --> "*" Libro : libros
    Editorial "1" --> "*" Libro : libros
    LibroGenero --> Libro
    LibroGenero --> Genero

    Libro "1" --> "*" Inventario
    Tienda "1" --> "*" Inventario

    Usuario "1" --> "*" Reserva
    Reserva "1" --> "*" ItemReserva
    Libro "1" --> "*" ItemReserva

    Usuario "1" --> "*" CarritoCompras
    CarritoCompras "1" --> "*" DetalleCarrito
    Libro "1" --> "*" DetalleCarrito

    Usuario "1" --> "*" Pedido
    Tienda "1" --> "*" Pedido
    Pedido "1" --> "*" ItemPedido
    Libro "1" --> "*" ItemPedido
    Pedido "1" --> "*" EstadoPedido

    Pedido "1" --> "*" Devolucion
    Usuario "1" --> "*" Devolucion

    Pedido "1" --> "*" FacturaElectronica
    Usuario "1" --> "*" FacturaElectronica

    Usuario "1" --> "*" Suscripcion

    Foro "1" --> "*" Mensaje
    Usuario "1" --> "*" Mensaje

    Usuario "1" --> "*" MetodoPago
    MetodoPago "1" --> "*" MovimientoSaldo
    Usuario "1" --> "*" MovimientoSaldo
    Pedido "1" --> "*" MovimientoSaldo

    Usuario "1" --> "*" SaldoUsuario
    Usuario "1" --> "*" RegistroBusqueda
    Usuario "1" --> "*" BonoCumpleanios

    PreferenciaLiteraria "1" --> "*" UsuarioPreferencia
    Usuario "1" --> "*" UsuarioPreferencia

    %% ╔══════════════════════════════════════════════╗
    %% ║        CAPA DE INFRAESTRUCTURA                ║
    %% ╚══════════════════════════════════════════════╝

    class PrismaClient {
        <<External>>
    }

    class PrismaService {
        <<Service>>
        +onModuleInit() Promise~void~
        +onModuleDestroy() Promise~void~
    }
    PrismaService --|> PrismaClient : extends

    class SendEmailOptions {
        <<Interface>>
        +String to
        +String subject
        +String html
        +String? text
    }

    class EmailService {
        <<Service>>
        -Logger logger
        -Resend resend
        +sendEmail(options: SendEmailOptions) Promise~void~
        +sendWelcomeEmail(nombre: string, correo: string) Promise~void~
    }
    EmailService ..> SendEmailOptions : uses

    %% ╔══════════════════════════════════════════════╗
    %% ║          GUARDS Y SEGURIDAD                   ║
    %% ╚══════════════════════════════════════════════╝

    class CanActivate {
        <<Interface>>
        +canActivate(context: ExecutionContext) boolean
    }

    class AuthGuard {
        <<Guard>>
        -Reflector reflector
        +canActivate(context: ExecutionContext) Promise~boolean~
        -extractTokenFromHeader(request: any) string
    }
    AuthGuard ..|> CanActivate : implements

    class RolesGuard {
        <<Guard>>
        -Reflector reflector
        +canActivate(context: ExecutionContext) boolean
    }
    RolesGuard ..|> CanActivate : implements

    %% ╔══════════════════════════════════════════════╗
    %% ║             UTILIDADES                        ║
    %% ╚══════════════════════════════════════════════╝

    class JwtPayload {
        <<Interface>>
        +String sub
        +String correo
        +String rol
    }

    class JwtUtil {
        <<Utility>>
        +signToken(payload: JwtPayload, expiresIn?: string) string
        +verifyToken(token: string) JwtPayload
        +decodeToken(token: string) JwtPayload
    }

    class BcryptUtil {
        <<Utility>>
        +hashPassword(plainPassword: string) Promise~string~
        +comparePassword(plain: string, hashed: string) Promise~boolean~
    }

    AuthGuard ..> JwtUtil : uses
    AuthGuard ..> JwtPayload : uses
    RolesGuard ..> JwtPayload : uses

    %% ╔══════════════════════════════════════════════╗
    %% ║     CONTROLADORES (Capa de Presentación)      ║
    %% ╚══════════════════════════════════════════════╝

    class UsersController {
        <<Controller>>
        -UsersService usersService
        +register(dto: CreateUserDto) Promise
        +registerAdmin(dto: CreateUserDto) Promise
        +login(dto: LoginDto) Promise
        +getProfile(user: JwtPayload) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateUserDto) Promise
        +remove(id: string) Promise
    }

    class AutoresController {
        <<Controller>>
        -AutoresService autoresService
        +create(dto: CreateAutoreDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateAutoreDto) Promise
        +remove(id: string) Promise
    }

    class GenerosController {
        <<Controller>>
        -GenerosService generosService
        +create(dto: CreateGeneroDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateGeneroDto) Promise
        +remove(id: string) Promise
    }

    class EditorialesController {
        <<Controller>>
        -EditorialesService editorialesService
        +create(dto: CreateEditorialeDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateEditorialeDto) Promise
        +remove(id: string) Promise
    }

    class TiendasController {
        <<Controller>>
        -TiendasService tiendasService
        +create(dto: CreateTiendaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateTiendaDto) Promise
        +remove(id: string) Promise
    }

    class LibrosController {
        <<Controller>>
        -LibrosService librosService
        +create(dto: CreateLibroDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateLibroDto) Promise
        +remove(id: string) Promise
    }

    class InventariosController {
        <<Controller>>
        -InventariosService inventariosService
        +create(dto: CreateInventarioDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateInventarioDto) Promise
        +remove(id: string) Promise
    }

    class ReservasController {
        <<Controller>>
        -ReservasService reservasService
        +create(dto: CreateReservaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateReservaDto) Promise
        +remove(id: string) Promise
    }

    class ItemsReservaController {
        <<Controller>>
        -ItemsReservaService itemsReservaService
        +create(dto: CreateItemsReservaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateItemsReservaDto) Promise
        +remove(id: string) Promise
    }

    class CarritosController {
        <<Controller>>
        -CarritosService carritosService
        +create(dto: CreateCarritoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateCarritoDto) Promise
        +remove(id: string) Promise
    }

    class DetallesCarritoController {
        <<Controller>>
        -DetallesCarritoService detallesCarritoService
        +create(dto: CreateDetallesCarritoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateDetallesCarritoDto) Promise
        +remove(id: string) Promise
    }

    class PedidosController {
        <<Controller>>
        -PedidosService pedidosService
        +create(dto: CreatePedidoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdatePedidoDto) Promise
        +remove(id: string) Promise
    }

    class EstadosPedidoController {
        <<Controller>>
        -EstadosPedidoService estadosPedidoService
        +create(dto: CreateEstadosPedidoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateEstadosPedidoDto) Promise
        +remove(id: string) Promise
    }

    class ItemsPedidoController {
        <<Controller>>
        -ItemsPedidoService itemsPedidoService
        +create(dto: CreateItemsPedidoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateItemsPedidoDto) Promise
        +remove(id: string) Promise
    }

    class DevolucionesController {
        <<Controller>>
        -DevolucionesService devolucionesService
        +create(dto: CreateDevolucioneDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateDevolucioneDto) Promise
        +remove(id: string) Promise
    }

    class FacturasController {
        <<Controller>>
        -FacturasService facturasService
        +create(dto: CreateFacturaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateFacturaDto) Promise
        +remove(id: string) Promise
    }

    class SuscripcionesController {
        <<Controller>>
        -SuscripcionesService suscripcionesService
        +create(dto: CreateSuscripcioneDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateSuscripcioneDto) Promise
        +remove(id: string) Promise
    }

    class ForosController {
        <<Controller>>
        -ForosService forosService
        +create(dto: CreateForoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateForoDto) Promise
        +remove(id: string) Promise
    }

    class MensajesController {
        <<Controller>>
        -MensajesService mensajesService
        +create(dto: CreateMensajeDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateMensajeDto) Promise
        +remove(id: string) Promise
    }

    class MetodosPagoController {
        <<Controller>>
        -MetodosPagoService metodosPagoService
        +create(dto: CreateMetodosPagoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateMetodosPagoDto) Promise
        +remove(id: string) Promise
    }

    class SaldosUsuarioController {
        <<Controller>>
        -SaldosUsuarioService saldosUsuarioService
        +create(dto: CreateSaldosUsuarioDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateSaldosUsuarioDto) Promise
        +remove(id: string) Promise
    }

    class MovimientosSaldoController {
        <<Controller>>
        -MovimientosSaldoService movimientosSaldoService
        +create(dto: CreateMovimientosSaldoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateMovimientosSaldoDto) Promise
        +remove(id: string) Promise
    }

    class RegistrosBusquedaController {
        <<Controller>>
        -RegistrosBusquedaService registrosBusquedaService
        +create(dto: CreateRegistrosBusquedaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateRegistrosBusquedaDto) Promise
        +remove(id: string) Promise
    }

    class BonosCumpleaniosController {
        <<Controller>>
        -BonosCumpleaniosService bonosCumpleaniosService
        +create(dto: CreateBonosCumpleanioDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateBonosCumpleanioDto) Promise
        +remove(id: string) Promise
    }

    class PreferenciasLiterariasController {
        <<Controller>>
        -PreferenciasLiterariasService preferenciasLiterariasService
        +create(dto: CreatePreferenciasLiterariaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdatePreferenciasLiterariaDto) Promise
        +remove(id: string) Promise
    }

    class UsuariosPreferenciasController {
        <<Controller>>
        -UsuariosPreferenciasService usuariosPreferenciasService
        +create(dto: CreateUsuariosPreferenciaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateUsuariosPreferenciaDto) Promise
        +remove(id: string) Promise
    }

    %% ╔══════════════════════════════════════════════╗
    %% ║      SERVICIOS (Capa de Lógica de Negocio)    ║
    %% ╚══════════════════════════════════════════════╝

    class UsersService {
        <<Service>>
        -PrismaService prisma
        -EmailService emailService
        +create(dto: CreateUserDto) Promise
        +createAdmin(dto: CreateUserDto) Promise
        -createWithRole(dto: CreateUserDto, rol: string) Promise
        +login(correo: string, contrasena: string) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateUserDto) Promise
        +remove(id: string) Promise
    }

    class AutoresService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateAutoreDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateAutoreDto) Promise
        +remove(id: number) Promise
    }

    class GenerosService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateGeneroDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateGeneroDto) Promise
        +remove(id: number) Promise
    }

    class EditorialesService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateEditorialeDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateEditorialeDto) Promise
        +remove(id: number) Promise
    }

    class TiendasService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateTiendaDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateTiendaDto) Promise
        +remove(id: number) Promise
    }

    class LibrosService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateLibroDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateLibroDto) Promise
        +remove(id: string) Promise
    }

    class InventariosService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateInventarioDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateInventarioDto) Promise
        +remove(id: number) Promise
    }

    class ReservasService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateReservaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateReservaDto) Promise
        +remove(id: string) Promise
    }

    class ItemsReservaService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateItemsReservaDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateItemsReservaDto) Promise
        +remove(id: number) Promise
    }

    class CarritosService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateCarritoDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateCarritoDto) Promise
        +remove(id: number) Promise
    }

    class DetallesCarritoService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateDetallesCarritoDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateDetallesCarritoDto) Promise
        +remove(id: number) Promise
    }

    class PedidosService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreatePedidoDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdatePedidoDto) Promise
        +remove(id: string) Promise
    }

    class EstadosPedidoService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateEstadosPedidoDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateEstadosPedidoDto) Promise
        +remove(id: number) Promise
    }

    class ItemsPedidoService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateItemsPedidoDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateItemsPedidoDto) Promise
        +remove(id: number) Promise
    }

    class DevolucionesService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateDevolucioneDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateDevolucioneDto) Promise
        +remove(id: string) Promise
    }

    class FacturasService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateFacturaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateFacturaDto) Promise
        +remove(id: string) Promise
    }

    class SuscripcionesService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateSuscripcioneDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateSuscripcioneDto) Promise
        +remove(id: number) Promise
    }

    class ForosService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateForoDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateForoDto) Promise
        +remove(id: number) Promise
    }

    class MensajesService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateMensajeDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateMensajeDto) Promise
        +remove(id: string) Promise
    }

    class MetodosPagoService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateMetodosPagoDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateMetodosPagoDto) Promise
        +remove(id: number) Promise
    }

    class SaldosUsuarioService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateSaldosUsuarioDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateSaldosUsuarioDto) Promise
        +remove(id: number) Promise
    }

    class MovimientosSaldoService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateMovimientosSaldoDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateMovimientosSaldoDto) Promise
        +remove(id: number) Promise
    }

    class RegistrosBusquedaService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateRegistrosBusquedaDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateRegistrosBusquedaDto) Promise
        +remove(id: number) Promise
    }

    class BonosCumpleaniosService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateBonosCumpleanioDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateBonosCumpleanioDto) Promise
        +remove(id: number) Promise
    }

    class PreferenciasLiterariasService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreatePreferenciasLiterariaDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdatePreferenciasLiterariaDto) Promise
        +remove(id: number) Promise
    }

    class UsuariosPreferenciasService {
        <<Service>>
        -PrismaService prisma
        +create(dto: CreateUsuariosPreferenciaDto) Promise
        +findAll() Promise
        +findOne(id: number) Promise
        +update(id: number, dto: UpdateUsuariosPreferenciaDto) Promise
        +remove(id: number) Promise
    }

    %% ╔══════════════════════════════════════════════╗
    %% ║  RELACIONES: Controller → Service → Prisma   ║
    %% ╚══════════════════════════════════════════════╝

    UsersController --> UsersService
    UsersService --> PrismaService
    UsersService --> EmailService

    AutoresController --> AutoresService
    AutoresService --> PrismaService

    GenerosController --> GenerosService
    GenerosService --> PrismaService

    EditorialesController --> EditorialesService
    EditorialesService --> PrismaService

    TiendasController --> TiendasService
    TiendasService --> PrismaService

    LibrosController --> LibrosService
    LibrosService --> PrismaService

    InventariosController --> InventariosService
    InventariosService --> PrismaService

    ReservasController --> ReservasService
    ReservasService --> PrismaService

    ItemsReservaController --> ItemsReservaService
    ItemsReservaService --> PrismaService

    CarritosController --> CarritosService
    CarritosService --> PrismaService

    DetallesCarritoController --> DetallesCarritoService
    DetallesCarritoService --> PrismaService

    PedidosController --> PedidosService
    PedidosService --> PrismaService

    EstadosPedidoController --> EstadosPedidoService
    EstadosPedidoService --> PrismaService

    ItemsPedidoController --> ItemsPedidoService
    ItemsPedidoService --> PrismaService

    DevolucionesController --> DevolucionesService
    DevolucionesService --> PrismaService

    FacturasController --> FacturasService
    FacturasService --> PrismaService

    SuscripcionesController --> SuscripcionesService
    SuscripcionesService --> PrismaService

    ForosController --> ForosService
    ForosService --> PrismaService

    MensajesController --> MensajesService
    MensajesService --> PrismaService

    MetodosPagoController --> MetodosPagoService
    MetodosPagoService --> PrismaService

    SaldosUsuarioController --> SaldosUsuarioService
    SaldosUsuarioService --> PrismaService

    MovimientosSaldoController --> MovimientosSaldoService
    MovimientosSaldoService --> PrismaService

    RegistrosBusquedaController --> RegistrosBusquedaService
    RegistrosBusquedaService --> PrismaService

    BonosCumpleaniosController --> BonosCumpleaniosService
    BonosCumpleaniosService --> PrismaService

    PreferenciasLiterariasController --> PreferenciasLiterariasService
    PreferenciasLiterariasService --> PrismaService

    UsuariosPreferenciasController --> UsuariosPreferenciasService
    UsuariosPreferenciasService --> PrismaService

    UsersService ..> BcryptUtil : uses
    UsersService ..> JwtUtil : uses
```

---

## Resumen

| Capa | Cantidad | Descripción |
|------|----------|-------------|
| **Controllers** | 26 | Manejan las peticiones HTTP (REST API) |
| **Services** | 28 | Lógica de negocio e interacción con BD |
| **Guards** | 2 | `AuthGuard` (JWT) y `RolesGuard` (RBAC) |
| **Utilities** | 2 | `JwtUtil` y `BcryptUtil` |
| **Entidades (Prisma)** | 21 | Modelos de dominio mapeados a PostgreSQL |
| **Enums** | 8 | Tipos enumerados del dominio |
| **DTOs** | ~54 | Create/Update DTOs para validación |
| **Infraestructura** | 2 | `PrismaService` y `EmailService` |
