-- AlterTable: agregar columnas a foro
ALTER TABLE "foro"
  ADD COLUMN "id_usuario_creador" UUID,
  ADD COLUMN "fecha_actualizacion" TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Asignar un usuario existente a los foros huérfanos (seed usa IDs conocidos)
UPDATE "foro"
SET "id_usuario_creador" = (SELECT id FROM "usuario" WHERE rol = 'cliente' LIMIT 1)
WHERE "id_usuario_creador" IS NULL;

-- Ahora hacer la columna NOT NULL
ALTER TABLE "foro"
  ALTER COLUMN "id_usuario_creador" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "foro"
  ADD CONSTRAINT "foro_id_usuario_creador_fkey"
  FOREIGN KEY ("id_usuario_creador")
  REFERENCES "usuario"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
