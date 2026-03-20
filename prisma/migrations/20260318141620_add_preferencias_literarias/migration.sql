-- CreateTable
CREATE TABLE "preferencia_literaria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "preferencia_literaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_preferencia" (
    "id_usuario" UUID NOT NULL,
    "id_preferencia_literaria" INTEGER NOT NULL,

    CONSTRAINT "usuario_preferencia_pkey" PRIMARY KEY ("id_usuario","id_preferencia_literaria")
);

-- CreateIndex
CREATE UNIQUE INDEX "preferencia_literaria_nombre_key" ON "preferencia_literaria"("nombre");

-- AddForeignKey
ALTER TABLE "usuario_preferencia" ADD CONSTRAINT "usuario_preferencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_preferencia" ADD CONSTRAINT "usuario_preferencia_id_preferencia_literaria_fkey" FOREIGN KEY ("id_preferencia_literaria") REFERENCES "preferencia_literaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
