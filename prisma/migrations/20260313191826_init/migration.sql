-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('root', 'administrador', 'cliente', 'visitante');

-- CreateEnum
CREATE TYPE "EstadoLibro" AS ENUM ('nuevo', 'usado');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('activa', 'expirada', 'cancelada', 'convertida');

-- CreateEnum
CREATE TYPE "MetodoEntrega" AS ENUM ('domicilio', 'tienda');

-- CreateEnum
CREATE TYPE "EstadoPedidoVal" AS ENUM ('en_preparacion', 'enviado', 'entregado');

-- CreateEnum
CREATE TYPE "EstadoDevolucion" AS ENUM ('solicitada', 'aprobada', 'rechazada');

-- CreateEnum
CREATE TYPE "TipoTarjeta" AS ENUM ('credito', 'debito');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('recarga', 'compra', 'devolucion', 'bono');

-- CreateTable
CREATE TABLE "autor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genero" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "editorial" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "editorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tienda" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "latitud" DECIMAL(65,30) NOT NULL,
    "longitud" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "tienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "rol" "RolUsuario" NOT NULL,
    "estado_cuenta" BOOLEAN NOT NULL,
    "fecha_registro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libro" (
    "id" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "id_autor" INTEGER NOT NULL,
    "id_genero" INTEGER NOT NULL,
    "id_editorial" INTEGER NOT NULL,
    "ano_publicacion" INTEGER NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "isbn" TEXT NOT NULL,
    "idioma" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen_portada" TEXT,
    "estado" "EstadoLibro" NOT NULL,

    CONSTRAINT "libro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario" (
    "id" SERIAL NOT NULL,
    "id_libro" UUID NOT NULL,
    "id_tienda" INTEGER NOT NULL,
    "cantidad_disponible" INTEGER NOT NULL,
    "cantidad_bloqueada" INTEGER NOT NULL,
    "fecha_actualizacion" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "hora_creacion" TIMESTAMPTZ NOT NULL,
    "hora_expiracion" TIMESTAMPTZ NOT NULL,
    "estado" "EstadoReserva" NOT NULL,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_reserva" (
    "id" SERIAL NOT NULL,
    "id_reserva" UUID NOT NULL,
    "id_libro" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "item_reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito_compras" (
    "id" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "fecha_creacion" TIMESTAMPTZ NOT NULL,
    "fecha_actualizacion" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "carrito_compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_carrito" (
    "id" SERIAL NOT NULL,
    "id_carrito" INTEGER NOT NULL,
    "id_libro" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "detalle_carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "numero_orden" TEXT NOT NULL,
    "fecha_orden" TIMESTAMPTZ NOT NULL,
    "monto_total" DECIMAL(65,30) NOT NULL,
    "metodo_entrega" "MetodoEntrega" NOT NULL,
    "id_tienda" INTEGER,
    "direccion_entrega" TEXT,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_pedido" (
    "id" SERIAL NOT NULL,
    "id_pedido" UUID NOT NULL,
    "id_libro" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "item_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado_pedido" (
    "id" SERIAL NOT NULL,
    "id_pedido" UUID NOT NULL,
    "estado" "EstadoPedidoVal" NOT NULL,
    "fecha_cambio" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "estado_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolucion" (
    "id" UUID NOT NULL,
    "id_pedido" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "razon" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoDevolucion" NOT NULL,
    "codigo_qr" TEXT,

    CONSTRAINT "devolucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura_electronica" (
    "id" UUID NOT NULL,
    "id_pedido" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "monto_subtotal" DECIMAL(65,30) NOT NULL,
    "iva" DECIMAL(65,30) NOT NULL,
    "monto_total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "factura_electronica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripcion" (
    "id" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "activa" BOOLEAN NOT NULL,

    CONSTRAINT "suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "foro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensaje" (
    "id" UUID NOT NULL,
    "id_foro" INTEGER NOT NULL,
    "id_remitente" UUID NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_hora" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodo_pago" (
    "id" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "tipo" "TipoTarjeta" NOT NULL,
    "numero_enmascarado" TEXT NOT NULL,
    "titular" TEXT NOT NULL,

    CONSTRAINT "metodo_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saldo_usuario" (
    "id" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "saldo_disponible" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "saldo_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimiento_saldo" (
    "id" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "tipo_movimiento" "TipoMovimiento" NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "id_pedido" UUID,
    "id_metodo_pago" INTEGER,

    CONSTRAINT "movimiento_saldo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_busqueda" (
    "id" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "criterio" TEXT NOT NULL,

    CONSTRAINT "registro_busqueda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bono_cumpleanios" (
    "id" SERIAL NOT NULL,
    "id_usuario" UUID NOT NULL,
    "porcentaje_descuento" DECIMAL(65,30) NOT NULL,
    "fecha_vigencia" DATE NOT NULL,

    CONSTRAINT "bono_cumpleanios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- AddForeignKey
ALTER TABLE "libro" ADD CONSTRAINT "libro_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "autor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro" ADD CONSTRAINT "libro_id_genero_fkey" FOREIGN KEY ("id_genero") REFERENCES "genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro" ADD CONSTRAINT "libro_id_editorial_fkey" FOREIGN KEY ("id_editorial") REFERENCES "editorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "tienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_reserva" ADD CONSTRAINT "item_reserva_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_reserva" ADD CONSTRAINT "item_reserva_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_compras" ADD CONSTRAINT "carrito_compras_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_carrito" ADD CONSTRAINT "detalle_carrito_id_carrito_fkey" FOREIGN KEY ("id_carrito") REFERENCES "carrito_compras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_carrito" ADD CONSTRAINT "detalle_carrito_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_tienda_fkey" FOREIGN KEY ("id_tienda") REFERENCES "tienda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estado_pedido" ADD CONSTRAINT "estado_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucion" ADD CONSTRAINT "devolucion_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucion" ADD CONSTRAINT "devolucion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_electronica" ADD CONSTRAINT "factura_electronica_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_electronica" ADD CONSTRAINT "factura_electronica_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripcion" ADD CONSTRAINT "suscripcion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensaje" ADD CONSTRAINT "mensaje_id_foro_fkey" FOREIGN KEY ("id_foro") REFERENCES "foro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensaje" ADD CONSTRAINT "mensaje_id_remitente_fkey" FOREIGN KEY ("id_remitente") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metodo_pago" ADD CONSTRAINT "metodo_pago_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saldo_usuario" ADD CONSTRAINT "saldo_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_saldo" ADD CONSTRAINT "movimiento_saldo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_saldo" ADD CONSTRAINT "movimiento_saldo_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_saldo" ADD CONSTRAINT "movimiento_saldo_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "metodo_pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_busqueda" ADD CONSTRAINT "registro_busqueda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bono_cumpleanios" ADD CONSTRAINT "bono_cumpleanios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
