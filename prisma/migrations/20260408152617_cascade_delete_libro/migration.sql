-- DropForeignKey
ALTER TABLE "detalle_carrito" DROP CONSTRAINT "detalle_carrito_id_libro_fkey";

-- DropForeignKey
ALTER TABLE "inventario" DROP CONSTRAINT "inventario_id_libro_fkey";

-- DropForeignKey
ALTER TABLE "item_pedido" DROP CONSTRAINT "item_pedido_id_libro_fkey";

-- DropForeignKey
ALTER TABLE "item_reserva" DROP CONSTRAINT "item_reserva_id_libro_fkey";

-- DropForeignKey
ALTER TABLE "libro_genero" DROP CONSTRAINT "libro_genero_id_libro_fkey";

-- DropIndex
DROP INDEX "libro_genero_id_genero_idx";

-- AddForeignKey
ALTER TABLE "libro_genero" ADD CONSTRAINT "libro_genero_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_reserva" ADD CONSTRAINT "item_reserva_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_carrito" ADD CONSTRAINT "detalle_carrito_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
