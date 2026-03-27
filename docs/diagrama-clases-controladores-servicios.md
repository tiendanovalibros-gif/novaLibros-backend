# Diagrama de Clases — Controladores, Servicios y Guards

> Capa de aplicación del backend NovaLibros (NestJS).
> Patrón: `Guard → Controller → Service → PrismaService`

---

```mermaid
classDiagram
    direction TB

    %% ╔══════════════════════════════════════════════╗
    %% ║              INTERFACES                       ║
    %% ╚══════════════════════════════════════════════╝

    class CanActivate {
        <<Interface>>
        +canActivate(context: ExecutionContext) boolean
    }

    class JwtPayload {
        <<Interface>>
        +String sub
        +String correo
        +String rol
    }

    class SendEmailOptions {
        <<Interface>>
        +String to
        +String subject
        +String html
        +String? text
    }

    %% ╔══════════════════════════════════════════════╗
    %% ║              UTILIDADES                       ║
    %% ╚══════════════════════════════════════════════╝

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

    %% ╔══════════════════════════════════════════════╗
    %% ║              GUARDS                           ║
    %% ╚══════════════════════════════════════════════╝

    class AuthGuard {
        <<Guard>>
        -Reflector reflector
        +canActivate(context: ExecutionContext) Promise~boolean~
        -extractTokenFromHeader(request: any) string
    }
    AuthGuard ..|> CanActivate : implements
    AuthGuard ..> JwtUtil : verifyToken
    AuthGuard ..> JwtPayload : extracts

    class RolesGuard {
        <<Guard>>
        -Reflector reflector
        +canActivate(context: ExecutionContext) boolean
    }
    RolesGuard ..|> CanActivate : implements
    RolesGuard ..> JwtPayload : reads rol

    %% ╔══════════════════════════════════════════════╗
    %% ║         INFRAESTRUCTURA COMPARTIDA            ║
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

    class EmailService {
        <<Service>>
        -Logger logger
        -Resend resend
        +sendEmail(options: SendEmailOptions) Promise~void~
        +sendWelcomeEmail(nombre: string, correo: string) Promise~void~
    }
    EmailService ..> SendEmailOptions : uses

    %% ╔══════════════════════════════════════════════╗
    %% ║             CONTROLADORES                     ║
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
        -PreferenciasLiterariasService svc
        +create(dto: CreatePreferenciasLiterariaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdatePreferenciasLiterariaDto) Promise
        +remove(id: string) Promise
    }

    class UsuariosPreferenciasController {
        <<Controller>>
        -UsuariosPreferenciasService svc
        +create(dto: CreateUsuariosPreferenciaDto) Promise
        +findAll() Promise
        +findOne(id: string) Promise
        +update(id: string, dto: UpdateUsuariosPreferenciaDto) Promise
        +remove(id: string) Promise
    }

    %% ╔══════════════════════════════════════════════╗
    %% ║               SERVICIOS                       ║
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
    %% ║  Guards protegen TODOS los Controllers        ║
    %% ╚══════════════════════════════════════════════╝

    AuthGuard <.. UsersController : @UseGuards
    RolesGuard <.. UsersController : @UseGuards
    AuthGuard <.. AutoresController : @UseGuards
    RolesGuard <.. AutoresController : @UseGuards
    AuthGuard <.. GenerosController : @UseGuards
    RolesGuard <.. GenerosController : @UseGuards
    AuthGuard <.. EditorialesController : @UseGuards
    RolesGuard <.. EditorialesController : @UseGuards
    AuthGuard <.. TiendasController : @UseGuards
    RolesGuard <.. TiendasController : @UseGuards
    AuthGuard <.. LibrosController : @UseGuards
    RolesGuard <.. LibrosController : @UseGuards
    AuthGuard <.. InventariosController : @UseGuards
    RolesGuard <.. InventariosController : @UseGuards
    AuthGuard <.. ReservasController : @UseGuards
    RolesGuard <.. ReservasController : @UseGuards
    AuthGuard <.. ItemsReservaController : @UseGuards
    RolesGuard <.. ItemsReservaController : @UseGuards
    AuthGuard <.. CarritosController : @UseGuards
    RolesGuard <.. CarritosController : @UseGuards
    AuthGuard <.. DetallesCarritoController : @UseGuards
    RolesGuard <.. DetallesCarritoController : @UseGuards
    AuthGuard <.. PedidosController : @UseGuards
    RolesGuard <.. PedidosController : @UseGuards
    AuthGuard <.. EstadosPedidoController : @UseGuards
    RolesGuard <.. EstadosPedidoController : @UseGuards
    AuthGuard <.. ItemsPedidoController : @UseGuards
    RolesGuard <.. ItemsPedidoController : @UseGuards
    AuthGuard <.. DevolucionesController : @UseGuards
    RolesGuard <.. DevolucionesController : @UseGuards
    AuthGuard <.. FacturasController : @UseGuards
    RolesGuard <.. FacturasController : @UseGuards
    AuthGuard <.. SuscripcionesController : @UseGuards
    RolesGuard <.. SuscripcionesController : @UseGuards
    AuthGuard <.. ForosController : @UseGuards
    RolesGuard <.. ForosController : @UseGuards
    AuthGuard <.. MensajesController : @UseGuards
    RolesGuard <.. MensajesController : @UseGuards
    AuthGuard <.. MetodosPagoController : @UseGuards
    RolesGuard <.. MetodosPagoController : @UseGuards
    AuthGuard <.. SaldosUsuarioController : @UseGuards
    RolesGuard <.. SaldosUsuarioController : @UseGuards
    AuthGuard <.. MovimientosSaldoController : @UseGuards
    RolesGuard <.. MovimientosSaldoController : @UseGuards
    AuthGuard <.. RegistrosBusquedaController : @UseGuards
    RolesGuard <.. RegistrosBusquedaController : @UseGuards
    AuthGuard <.. BonosCumpleaniosController : @UseGuards
    RolesGuard <.. BonosCumpleaniosController : @UseGuards
    AuthGuard <.. PreferenciasLiterariasController : @UseGuards
    RolesGuard <.. PreferenciasLiterariasController : @UseGuards
    AuthGuard <.. UsuariosPreferenciasController : @UseGuards
    RolesGuard <.. UsuariosPreferenciasController : @UseGuards

    %% ╔══════════════════════════════════════════════╗
    %% ║  Controller → Service → PrismaService         ║
    %% ╚══════════════════════════════════════════════╝

    UsersController --> UsersService
    UsersService --> PrismaService
    UsersService --> EmailService
    UsersService ..> BcryptUtil : hashPassword
    UsersService ..> JwtUtil : signToken

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
```
