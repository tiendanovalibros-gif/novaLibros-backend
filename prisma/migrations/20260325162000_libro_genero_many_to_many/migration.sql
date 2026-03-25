-- CreateTable
CREATE TABLE "libro_genero" (
    "id_libro" UUID NOT NULL,
    "id_genero" INTEGER NOT NULL,

    CONSTRAINT "libro_genero_pkey" PRIMARY KEY ("id_libro", "id_genero")
);

-- Backfill existing Libro -> Genero relation
INSERT INTO "libro_genero" ("id_libro", "id_genero")
SELECT "id", "id_genero"
FROM "libro";

-- Drop old one-to-many column from libro
ALTER TABLE "libro" DROP COLUMN "id_genero";

-- CreateIndex
CREATE INDEX "libro_genero_id_genero_idx" ON "libro_genero"("id_genero");

-- AddForeignKey
ALTER TABLE "libro_genero" ADD CONSTRAINT "libro_genero_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro_genero" ADD CONSTRAINT "libro_genero_id_genero_fkey" FOREIGN KEY ("id_genero") REFERENCES "genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
