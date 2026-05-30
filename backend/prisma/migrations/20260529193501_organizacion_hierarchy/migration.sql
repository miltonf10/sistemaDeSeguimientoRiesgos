/*
  Warnings:

  - You are about to drop the column `subproceso` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `dependenciaId` on the `Proceso` table. All the data in the column will be lost.
  - You are about to drop the column `grupo` on the `Proceso` table. All the data in the column will be lost.
  - You are about to drop the column `objetivo` on the `Proceso` table. All the data in the column will be lost.
  - Added the required column `macroprocesoId` to the `Proceso` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Proceso" DROP CONSTRAINT "Proceso_dependenciaId_fkey";

-- AlterTable
ALTER TABLE "Activo" DROP COLUMN "subproceso",
ADD COLUMN     "macroprocesoId" TEXT,
ADD COLUMN     "subprocesoId" TEXT;

-- AlterTable
ALTER TABLE "Proceso" DROP COLUMN "dependenciaId",
DROP COLUMN "grupo",
DROP COLUMN "objetivo",
ADD COLUMN     "macroprocesoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Macroproceso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "dependenciaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Macroproceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subproceso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "procesoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subproceso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Macroproceso" ADD CONSTRAINT "Macroproceso_dependenciaId_fkey" FOREIGN KEY ("dependenciaId") REFERENCES "Dependencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proceso" ADD CONSTRAINT "Proceso_macroprocesoId_fkey" FOREIGN KEY ("macroprocesoId") REFERENCES "Macroproceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subproceso" ADD CONSTRAINT "Subproceso_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activo" ADD CONSTRAINT "Activo_macroprocesoId_fkey" FOREIGN KEY ("macroprocesoId") REFERENCES "Macroproceso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activo" ADD CONSTRAINT "Activo_subprocesoId_fkey" FOREIGN KEY ("subprocesoId") REFERENCES "Subproceso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
