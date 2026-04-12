/*
  Warnings:

  - A unique constraint covering the columns `[id_libro,id_tienda]` on the table `inventario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "password_reset_token" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_token_key" ON "password_reset_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_id_libro_id_tienda_key" ON "inventario"("id_libro", "id_tienda");

-- AddForeignKey
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
