/*
  Warnings:

  - The primary key for the `usuario_preferencia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id_usuario,id_preferencia_literaria]` on the table `usuario_preferencia` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuario_preferencia" DROP CONSTRAINT "usuario_preferencia_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "usuario_preferencia_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_preferencia_id_usuario_id_preferencia_literaria_key" ON "usuario_preferencia"("id_usuario", "id_preferencia_literaria");
