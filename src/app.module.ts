import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { AutoresModule } from './autores/autores.module';
import { GenerosModule } from './generos/generos.module';
import { EditorialesModule } from './editoriales/editoriales.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { LibrosModule } from './libros/libros.module';
import { InventariosModule } from './inventarios/inventarios.module';
import { ReservasModule } from './reservas/reservas.module';
import { ItemsReservaModule } from './items-reserva/items-reserva.module';
import { CarritosModule } from './carritos/carritos.module';
import { DetallesCarritoModule } from './detalles-carrito/detalles-carrito.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { EstadosPedidoModule } from './estados-pedido/estados-pedido.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import { FacturasModule } from './facturas/facturas.module';
import { SuscripcionesModule } from './suscripciones/suscripciones.module';
import { ItemsPedidoModule } from './items-pedido/items-pedido.module';
import { ForosModule } from './foros/foros.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';
import { SaldosUsuarioModule } from './saldos-usuario/saldos-usuario.module';
import { MovimientosSaldoModule } from './movimientos-saldo/movimientos-saldo.module';
import { RegistrosBusquedaModule } from './registros-busqueda/registros-busqueda.module';
import { BonosCumpleaniosModule } from './bonos-cumpleanios/bonos-cumpleanios.module';
import { PreferenciasLiterariasModule } from './preferencias-literarias/preferencias-literarias.module';
import { UsuariosPreferenciasModule } from './usuarios-preferencias/usuarios-preferencias.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    EmailModule,
    AutoresModule,
    GenerosModule,
    EditorialesModule,
    TiendasModule,
    LibrosModule,
    InventariosModule,
    ReservasModule,
    ItemsReservaModule,
    CarritosModule,
    DetallesCarritoModule,
    PedidosModule,
    EstadosPedidoModule,
    DevolucionesModule,
    FacturasModule,
    SuscripcionesModule,
    ItemsPedidoModule,
    ForosModule,
    MensajesModule,
    MetodosPagoModule,
    SaldosUsuarioModule,
    MovimientosSaldoModule,
    RegistrosBusquedaModule,
    BonosCumpleaniosModule,
    PreferenciasLiterariasModule,
    UsuariosPreferenciasModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
