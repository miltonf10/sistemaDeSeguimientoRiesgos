-- AlterTable
ALTER TABLE "Macroproceso" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Subproceso" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;
