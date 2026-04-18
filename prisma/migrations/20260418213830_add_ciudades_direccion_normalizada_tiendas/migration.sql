-- AlterTable
ALTER TABLE "tienda" ADD COLUMN     "direccion_normalizada" TEXT,
ADD COLUMN     "id_ciudad" INTEGER;

-- CreateTable
CREATE TABLE "ciudad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "ciudad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ciudad_nombre_key" ON "ciudad"("nombre");

-- CreateIndex
CREATE INDEX "tienda_id_ciudad_idx" ON "tienda"("id_ciudad");

-- AddForeignKey
ALTER TABLE "tienda" ADD CONSTRAINT "tienda_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
