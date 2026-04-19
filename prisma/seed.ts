import 'dotenv/config';
import { PrismaClient } from '../node_modules/.prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString =
  process.env.SEED_DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'SEED_DATABASE_URL, DIRECT_URL o DATABASE_URL debe estar definido para ejecutar seeds',
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IDS = {
  usuarioAdmin: '11111111-1111-4111-8111-111111111111',
  usuarioCliente: '22222222-2222-4222-8222-222222222222',
  libro1: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  libro2: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
  reserva1: '33333333-3333-4333-8333-333333333333',
  pedido1: '44444444-4444-4444-8444-444444444444',
  devolucion1: '55555555-5555-4555-8555-555555555555',
  factura1: '66666666-6666-4666-8666-666666666666',
  mensaje1: '77777777-7777-4777-8777-777777777777',
};

async function seedAutores() {
  for (const nombre of ['Gabriel Garcia Marquez', 'Isabel Allende']) {
    const existente = await prisma.autor.findFirst({ where: { nombre } });
    if (!existente) {
      await prisma.autor.create({ data: { nombre } });
    }
  }
}

async function seedGeneros() {
  for (const nombre of ['Novela', 'Tecnologia']) {
    const existente = await prisma.genero.findFirst({ where: { nombre } });
    if (!existente) {
      await prisma.genero.create({ data: { nombre } });
    }
  }
}

async function seedEditoriales() {
  for (const nombre of ['Planeta', 'Alfaomega']) {
    const existente = await prisma.editorial.findFirst({ where: { nombre } });
    if (!existente) {
      await prisma.editorial.create({ data: { nombre } });
    }
  }
}

async function seedCiudades() {
  for (const nombre of ['Bogotá', 'Pereira', 'Medellín']) {
    await prisma.ciudad.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
}

async function seedTiendas() {
  const ciudad = await prisma.ciudad.findUnique({
    where: { nombre: 'Bogotá' },
  });

  if (!ciudad) {
    throw new Error('No se encontró ciudad para sembrar tienda');
  }

  const tienda = await prisma.tienda.findFirst({
    where: { nombre: 'Tienda Centro' },
  });

  if (!tienda) {
    await prisma.tienda.create({
      data: {
        nombre: 'Tienda Centro',
        direccion: 'Calle 100 # 7-45',
        direccionNormalizada: 'Calle 100 # 7-45, Bogotá, Colombia',
        latitud: '4.7110',
        longitud: '-74.0721',
        idCiudad: ciudad.id,
      },
    });
    return;
  }

  await prisma.tienda.update({
    where: { id: tienda.id },
    data: {
      direccionNormalizada: tienda.direccionNormalizada ?? tienda.direccion,
      idCiudad: tienda.idCiudad ?? ciudad.id,
    },
  });
}

async function seedUsuarios() {
  await prisma.usuario.upsert({
    where: { correo: 'admin@novalibros.com' },
    update: {
      dni: '10000001',
      nombre: 'Admin',
      apellido: 'Nova',
      fechaNacimiento: new Date('1990-01-01'),
      contrasenaHash: '$2b$10$seedadminhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rol: 'administrador',
      estadoCuenta: true,
    },
    create: {
      id: IDS.usuarioAdmin,
      dni: '10000001',
      nombre: 'Admin',
      apellido: 'Nova',
      fechaNacimiento: new Date('1990-01-01'),
      correo: 'admin@novalibros.com',
      contrasenaHash: '$2b$10$seedadminhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rol: 'administrador',
      estadoCuenta: true,
    },
  });

  await prisma.usuario.upsert({
    where: { correo: 'cliente@novalibros.com' },
    update: {
      dni: '10000002',
      nombre: 'Cliente',
      apellido: 'Demo',
      fechaNacimiento: new Date('1998-06-15'),
      contrasenaHash: '$2b$10$seedclientehashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rol: 'cliente',
      estadoCuenta: true,
    },
    create: {
      id: IDS.usuarioCliente,
      dni: '10000002',
      nombre: 'Cliente',
      apellido: 'Demo',
      fechaNacimiento: new Date('1998-06-15'),
      correo: 'cliente@novalibros.com',
      contrasenaHash: '$2b$10$seedclientehashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      rol: 'cliente',
      estadoCuenta: true,
    },
  });
}

async function seedLibros() {
  const autor = await prisma.autor.findFirst({
    where: { nombre: 'Gabriel Garcia Marquez' },
  });
  const editorial = await prisma.editorial.findFirst({
    where: { nombre: 'Planeta' },
  });

  if (!autor || !editorial) {
    throw new Error('No se encontraron autor/editorial para sembrar libros');
  }

  await prisma.libro.upsert({
    where: { id: IDS.libro1 },
    update: {
      titulo: 'Cien Anos de Soledad',
      idAutor: autor.id,
      idEditorial: editorial.id,
      anoPublicacion: 1967,
      precio: '79.90',
      isbn: '9780307474728',
      idioma: 'es',
      descripcion: 'Edicion de referencia para pruebas de seed',
      estado: 'nuevo',
    },
    create: {
      id: IDS.libro1,
      titulo: 'Cien Anos de Soledad',
      idAutor: autor.id,
      idEditorial: editorial.id,
      anoPublicacion: 1967,
      precio: '79.90',
      isbn: '9780307474728',
      idioma: 'es',
      descripcion: 'Edicion de referencia para pruebas de seed',
      estado: 'nuevo',
    },
  });

  await prisma.libro.upsert({
    where: { id: IDS.libro2 },
    update: {
      titulo: 'Introduccion a Bases de Datos',
      idAutor: autor.id,
      idEditorial: editorial.id,
      anoPublicacion: 2021,
      precio: '95.50',
      isbn: '9786077078753',
      idioma: 'es',
      descripcion: 'Libro tecnico para pruebas de seed',
      estado: 'usado',
    },
    create: {
      id: IDS.libro2,
      titulo: 'Introduccion a Bases de Datos',
      idAutor: autor.id,
      idEditorial: editorial.id,
      anoPublicacion: 2021,
      precio: '95.50',
      isbn: '9786077078753',
      idioma: 'es',
      descripcion: 'Libro tecnico para pruebas de seed',
      estado: 'usado',
    },
  });
}

async function seedLibroGenero() {
  const generoNovela = await prisma.genero.findFirst({
    where: { nombre: 'Novela' },
  });
  const generoTecnologia = await prisma.genero.findFirst({
    where: { nombre: 'Tecnologia' },
  });

  if (!generoNovela || !generoTecnologia) {
    throw new Error('No se encontraron generos para sembrar libro_genero');
  }

  await prisma.libroGenero.upsert({
    where: {
      idLibro_idGenero: {
        idLibro: IDS.libro1,
        idGenero: generoNovela.id,
      },
    },
    update: {},
    create: {
      idLibro: IDS.libro1,
      idGenero: generoNovela.id,
    },
  });

  await prisma.libroGenero.upsert({
    where: {
      idLibro_idGenero: {
        idLibro: IDS.libro2,
        idGenero: generoTecnologia.id,
      },
    },
    update: {},
    create: {
      idLibro: IDS.libro2,
      idGenero: generoTecnologia.id,
    },
  });
}

async function seedInventario() {
  const tiendas = await prisma.tienda.findMany({
    select: { id: true, nombre: true },
    orderBy: { id: 'asc' },
  });

  const libros = await prisma.libro.findMany({
    select: { id: true, titulo: true },
    orderBy: { titulo: 'asc' },
  });

  if (tiendas.length === 0) {
    throw new Error('No hay tiendas para sembrar inventario');
  }

  if (libros.length === 0) {
    throw new Error('No hay libros para sembrar inventario');
  }

  for (const tienda of tiendas) {
    for (const [index, libro] of libros.entries()) {
      const cantidadDisponible = 10 + ((index + tienda.id) % 21);
      const cantidadBloqueada = (index + tienda.id) % 3;

      await prisma.inventario.upsert({
        where: {
          idLibro_idTienda: {
            idLibro: libro.id,
            idTienda: tienda.id,
          },
        },
        update: {
          cantidadDisponible,
          cantidadBloqueada,
          fechaActualizacion: new Date(),
        },
        create: {
          idLibro: libro.id,
          idTienda: tienda.id,
          cantidadDisponible,
          cantidadBloqueada,
          fechaActualizacion: new Date(),
        },
      });
    }
  }
}

async function seedReserva() {
  await prisma.reserva.upsert({
    where: { id: IDS.reserva1 },
    update: {
      idUsuario: IDS.usuarioCliente,
      horaCreacion: new Date('2026-01-10T10:00:00Z'),
      horaExpiracion: new Date('2026-01-10T11:00:00Z'),
      estado: 'activa',
    },
    create: {
      id: IDS.reserva1,
      idUsuario: IDS.usuarioCliente,
      horaCreacion: new Date('2026-01-10T10:00:00Z'),
      horaExpiracion: new Date('2026-01-10T11:00:00Z'),
      estado: 'activa',
    },
  });
}

async function seedItemReserva() {
  const existente = await prisma.itemReserva.findFirst({
    where: {
      idReserva: IDS.reserva1,
      idLibro: IDS.libro1,
    },
  });

  if (!existente) {
    await prisma.itemReserva.create({
      data: {
        idReserva: IDS.reserva1,
        idLibro: IDS.libro1,
        cantidad: 1,
      },
    });
    return;
  }

  await prisma.itemReserva.update({
    where: { id: existente.id },
    data: { cantidad: 1 },
  });
}

async function seedCarritoCompras() {
  const carrito = await prisma.carritoCompras.findFirst({
    where: { idUsuario: IDS.usuarioCliente },
  });

  if (!carrito) {
    await prisma.carritoCompras.create({
      data: {
        idUsuario: IDS.usuarioCliente,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      },
    });
    return;
  }

  await prisma.carritoCompras.update({
    where: { id: carrito.id },
    data: { fechaActualizacion: new Date() },
  });
}

async function seedDetalleCarrito() {
  const carrito = await prisma.carritoCompras.findFirst({
    where: { idUsuario: IDS.usuarioCliente },
  });
  if (!carrito) {
    throw new Error('No se encontro carrito para sembrar detalle_carrito');
  }

  const existente = await prisma.detalleCarrito.findFirst({
    where: {
      idCarrito: carrito.id,
      idLibro: IDS.libro1,
    },
  });

  if (!existente) {
    await prisma.detalleCarrito.create({
      data: {
        idCarrito: carrito.id,
        idLibro: IDS.libro1,
        cantidad: 1,
        precioUnitario: '79.90',
      },
    });
    return;
  }

  await prisma.detalleCarrito.update({
    where: { id: existente.id },
    data: {
      cantidad: 1,
      precioUnitario: '79.90',
    },
  });
}

async function seedPedido() {
  const tienda = await prisma.tienda.findFirst({
    where: { nombre: 'Tienda Centro' },
  });
  if (!tienda) {
    throw new Error('No se encontro tienda para sembrar pedido');
  }

  await prisma.pedido.upsert({
    where: { id: IDS.pedido1 },
    update: {
      idUsuario: IDS.usuarioCliente,
      numeroOrden: 'ORD-0001',
      fechaOrden: new Date('2026-01-10T10:30:00Z'),
      montoTotal: '79.90',
      metodoEntrega: 'tienda',
      idTienda: tienda.id,
      direccionEntrega: null,
    },
    create: {
      id: IDS.pedido1,
      idUsuario: IDS.usuarioCliente,
      numeroOrden: 'ORD-0001',
      fechaOrden: new Date('2026-01-10T10:30:00Z'),
      montoTotal: '79.90',
      metodoEntrega: 'tienda',
      idTienda: tienda.id,
      direccionEntrega: null,
    },
  });
}

async function seedItemPedido() {
  const existente = await prisma.itemPedido.findFirst({
    where: {
      idPedido: IDS.pedido1,
      idLibro: IDS.libro1,
    },
  });

  if (!existente) {
    await prisma.itemPedido.create({
      data: {
        idPedido: IDS.pedido1,
        idLibro: IDS.libro1,
        cantidad: 1,
        precioUnitario: '79.90',
      },
    });
    return;
  }

  await prisma.itemPedido.update({
    where: { id: existente.id },
    data: {
      cantidad: 1,
      precioUnitario: '79.90',
    },
  });
}

async function seedEstadoPedido() {
  const existente = await prisma.estadoPedido.findFirst({
    where: {
      idPedido: IDS.pedido1,
      estado: 'en_preparacion',
    },
  });

  if (!existente) {
    await prisma.estadoPedido.create({
      data: {
        idPedido: IDS.pedido1,
        estado: 'en_preparacion',
        fechaCambio: new Date('2026-01-10T10:35:00Z'),
      },
    });
    return;
  }

  await prisma.estadoPedido.update({
    where: { id: existente.id },
    data: { fechaCambio: new Date('2026-01-10T10:35:00Z') },
  });
}

async function seedDevolucion() {
  await prisma.devolucion.upsert({
    where: { id: IDS.devolucion1 },
    update: {
      idPedido: IDS.pedido1,
      idUsuario: IDS.usuarioCliente,
      razon: 'Producto defectuoso',
      descripcion: 'Pagina rota en el capitulo 2',
      estado: 'solicitada',
      codigoQr: 'QR-DEV-0001',
    },
    create: {
      id: IDS.devolucion1,
      idPedido: IDS.pedido1,
      idUsuario: IDS.usuarioCliente,
      razon: 'Producto defectuoso',
      descripcion: 'Pagina rota en el capitulo 2',
      estado: 'solicitada',
      codigoQr: 'QR-DEV-0001',
    },
  });
}

async function seedFacturaElectronica() {
  await prisma.facturaElectronica.upsert({
    where: { id: IDS.factura1 },
    update: {
      idPedido: IDS.pedido1,
      idUsuario: IDS.usuarioCliente,
      montoSubtotal: '67.14',
      iva: '12.76',
      montoTotal: '79.90',
    },
    create: {
      id: IDS.factura1,
      idPedido: IDS.pedido1,
      idUsuario: IDS.usuarioCliente,
      montoSubtotal: '67.14',
      iva: '12.76',
      montoTotal: '79.90',
    },
  });
}

async function seedSuscripcion() {
  const existente = await prisma.suscripcion.findFirst({
    where: { idUsuario: IDS.usuarioCliente },
  });
  if (!existente) {
    await prisma.suscripcion.create({
      data: {
        idUsuario: IDS.usuarioCliente,
        activa: true,
      },
    });
    return;
  }

  await prisma.suscripcion.update({
    where: { id: existente.id },
    data: { activa: true },
  });
}

async function seedForo() {
  const foro = await prisma.foro.findFirst({
    where: { titulo: 'Recomendaciones de lectura' },
  });

  if (!foro) {
    await prisma.foro.create({
      data: {
        titulo: 'Recomendaciones de lectura',
        fechaCreacion: new Date('2026-01-05T08:00:00Z'),
      },
    });
    return;
  }

  await prisma.foro.update({
    where: { id: foro.id },
    data: { fechaCreacion: new Date('2026-01-05T08:00:00Z') },
  });
}

async function seedMensaje() {
  const foro = await prisma.foro.findFirst({
    where: { titulo: 'Recomendaciones de lectura' },
  });
  if (!foro) {
    throw new Error('No se encontro foro para sembrar mensaje');
  }

  await prisma.mensaje.upsert({
    where: { id: IDS.mensaje1 },
    update: {
      idForo: foro.id,
      idRemitente: IDS.usuarioCliente,
      contenido: 'Recomiendo leer clasicos latinoamericanos.',
      fechaHora: new Date('2026-01-05T08:10:00Z'),
    },
    create: {
      id: IDS.mensaje1,
      idForo: foro.id,
      idRemitente: IDS.usuarioCliente,
      contenido: 'Recomiendo leer clasicos latinoamericanos.',
      fechaHora: new Date('2026-01-05T08:10:00Z'),
    },
  });
}

async function seedMetodoPago() {
  const existente = await prisma.metodoPago.findFirst({
    where: {
      idUsuario: IDS.usuarioCliente,
      numeroEnmascarado: '**** **** **** 4242',
    },
  });

  if (!existente) {
    await prisma.metodoPago.create({
      data: {
        idUsuario: IDS.usuarioCliente,
        tipo: 'credito',
        numeroEnmascarado: '**** **** **** 4242',
        titular: 'Cliente Demo',
      },
    });
    return;
  }

  await prisma.metodoPago.update({
    where: { id: existente.id },
    data: {
      tipo: 'credito',
      titular: 'Cliente Demo',
    },
  });
}

async function seedSaldoUsuario() {
  const existente = await prisma.saldoUsuario.findFirst({
    where: { idUsuario: IDS.usuarioCliente },
  });

  if (!existente) {
    await prisma.saldoUsuario.create({
      data: {
        idUsuario: IDS.usuarioCliente,
        saldoDisponible: '150.00',
      },
    });
    return;
  }

  await prisma.saldoUsuario.update({
    where: { id: existente.id },
    data: { saldoDisponible: '150.00' },
  });
}

async function seedMovimientoSaldo() {
  const metodoPago = await prisma.metodoPago.findFirst({
    where: {
      idUsuario: IDS.usuarioCliente,
      numeroEnmascarado: '**** **** **** 4242',
    },
  });

  if (!metodoPago) {
    throw new Error(
      'No se encontro metodo de pago para sembrar movimiento_saldo',
    );
  }

  const existente = await prisma.movimientoSaldo.findFirst({
    where: {
      idUsuario: IDS.usuarioCliente,
      tipoMovimiento: 'compra',
      idPedido: IDS.pedido1,
    },
  });

  if (!existente) {
    await prisma.movimientoSaldo.create({
      data: {
        idUsuario: IDS.usuarioCliente,
        tipoMovimiento: 'compra',
        monto: '79.90',
        idPedido: IDS.pedido1,
        idMetodoPago: metodoPago.id,
      },
    });
    return;
  }

  await prisma.movimientoSaldo.update({
    where: { id: existente.id },
    data: {
      monto: '79.90',
      idMetodoPago: metodoPago.id,
    },
  });
}

async function seedRegistroBusqueda() {
  const existente = await prisma.registroBusqueda.findFirst({
    where: {
      idUsuario: IDS.usuarioCliente,
      criterio: 'novelas clasicas',
    },
  });

  if (!existente) {
    await prisma.registroBusqueda.create({
      data: {
        idUsuario: IDS.usuarioCliente,
        criterio: 'novelas clasicas',
      },
    });
    return;
  }

  await prisma.registroBusqueda.update({
    where: { id: existente.id },
    data: { criterio: 'novelas clasicas' },
  });
}

async function seedBonoCumpleanios() {
  const fechaVigencia = new Date('2026-12-31');

  const existente = await prisma.bonoCumpleanios.findFirst({
    where: {
      idUsuario: IDS.usuarioCliente,
      fechaVigencia,
    },
  });

  if (!existente) {
    await prisma.bonoCumpleanios.create({
      data: {
        idUsuario: IDS.usuarioCliente,
        porcentajeDescuento: '10.00',
        fechaVigencia,
      },
    });
    return;
  }

  await prisma.bonoCumpleanios.update({
    where: { id: existente.id },
    data: { porcentajeDescuento: '10.00' },
  });
}

async function seedPreferenciaLiteraria() {
  for (const nombre of ['Misterio', 'Ciencia ficcion']) {
    await prisma.preferenciaLiteraria.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
}

async function seedUsuarioPreferencia() {
  const preferencia = await prisma.preferenciaLiteraria.findUnique({
    where: { nombre: 'Misterio' },
  });
  if (!preferencia) {
    throw new Error(
      'No se encontro preferencia literaria para sembrar usuario_preferencia',
    );
  }

  await prisma.usuarioPreferencia.upsert({
    where: {
      idUsuario_idPreferenciaLiteraria: {
        idUsuario: IDS.usuarioCliente,
        idPreferenciaLiteraria: preferencia.id,
      },
    },
    update: {},
    create: {
      idUsuario: IDS.usuarioCliente,
      idPreferenciaLiteraria: preferencia.id,
    },
  });
}

async function main() {
  await seedAutores();
  await seedGeneros();
  await seedEditoriales();
  await seedCiudades();
  await seedTiendas();
  await seedUsuarios();
  await seedLibros();
  await seedLibroGenero();
  await seedInventario();
  await seedReserva();
  await seedItemReserva();
  await seedCarritoCompras();
  await seedDetalleCarrito();
  await seedPedido();
  await seedItemPedido();
  await seedEstadoPedido();
  await seedDevolucion();
  await seedFacturaElectronica();
  await seedSuscripcion();
  await seedForo();
  await seedMensaje();
  await seedMetodoPago();
  await seedSaldoUsuario();
  await seedMovimientoSaldo();
  await seedRegistroBusqueda();
  await seedBonoCumpleanios();
  await seedPreferenciaLiteraria();
  await seedUsuarioPreferencia();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('Seed ejecutado correctamente');
  })
  .catch(async (error) => {
    console.error('Error al ejecutar seed:', error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
