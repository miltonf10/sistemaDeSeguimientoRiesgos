/*
  Warnings:

  - You are about to drop the column `c` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `clasificacion` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `contieneDatPos` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `d` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `fundamentoLegal` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `i` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `soporte` on the `Activo` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacion` on the `Activo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activo" DROP COLUMN "c",
DROP COLUMN "clasificacion",
DROP COLUMN "contieneDatPos",
DROP COLUMN "d",
DROP COLUMN "estado",
DROP COLUMN "fundamentoLegal",
DROP COLUMN "i",
DROP COLUMN "soporte",
DROP COLUMN "ubicacion",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "codigoGestionDocumental" TEXT,
ADD COLUMN     "confidencialidad" TEXT,
ADD COLUMN     "contieneDatosMenores" BOOLEAN,
ADD COLUMN     "contieneDatosPersonales" BOOLEAN,
ADD COLUMN     "custodioCargo" TEXT,
ADD COLUMN     "disponibilidad" TEXT,
ADD COLUMN     "excepcionTotalParcial" TEXT,
ADD COLUMN     "existeAutorizacionTratamiento" BOOLEAN,
ADD COLUMN     "fechaClasificacion" TIMESTAMP(3),
ADD COLUMN     "fechaGeneracion" TIMESTAMP(3),
ADD COLUMN     "fechaIngresoArchivo" TIMESTAMP(3),
ADD COLUMN     "finalidadTratamiento" TEXT,
ADD COLUMN     "fundamentoConstitucionalLegal" TEXT,
ADD COLUMN     "fundamentoJuridicoExcepcion" TEXT,
ADD COLUMN     "informacionPublicada" BOOLEAN,
ADD COLUMN     "integridad" TEXT,
ADD COLUMN     "lugarConsulta" TEXT,
ADD COLUMN     "medioConservacion" TEXT,
ADD COLUMN     "objetoLegitimoExcepcion" TEXT,
ADD COLUMN     "procesoId" TEXT,
ADD COLUMN     "propietarioCargo" TEXT,
ADD COLUMN     "serieDocumental" TEXT,
ADD COLUMN     "soporteRegistro" TEXT,
ADD COLUMN     "subproceso" TEXT,
ADD COLUMN     "subserieDocumental" TEXT,
ADD COLUMN     "tiempoClasificacion" TEXT,
ADD COLUMN     "tiposDatosPersonales" TEXT,
ADD COLUMN     "valorC" INTEGER,
ADD COLUMN     "valorD" INTEGER,
ADD COLUMN     "valorI" INTEGER,
ALTER COLUMN "criticidad" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Activo" ADD CONSTRAINT "Activo_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "Proceso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
