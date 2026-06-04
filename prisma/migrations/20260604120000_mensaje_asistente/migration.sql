-- CreateEnum
CREATE TYPE "RolMensajeAsistente" AS ENUM ('user', 'assistant');

-- CreateTable
CREATE TABLE "mensaje_asistente" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "rol" "RolMensajeAsistente" NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_hora" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensaje_asistente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mensaje_asistente_id_usuario_fecha_hora_idx" ON "mensaje_asistente"("id_usuario", "fecha_hora");

-- AddForeignKey
ALTER TABLE "mensaje_asistente" ADD CONSTRAINT "mensaje_asistente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
