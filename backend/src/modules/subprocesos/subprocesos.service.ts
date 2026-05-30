import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubprocesosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subproceso.findMany({
      where: { activo: true },
      include: { proceso: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findByProceso(procesoId: string) {
    return this.prisma.subproceso.findMany({
      where: { activo: true, procesoId },
      orderBy: { nombre: 'asc' },
    });
  }
}
