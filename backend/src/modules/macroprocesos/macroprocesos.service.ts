import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MacroprocesosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.macroproceso.findMany({
      where: { activo: true },
      include: { dependencia: true, procesos: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findByDependencia(dependenciaId: string) {
    return this.prisma.macroproceso.findMany({
      where: { activo: true, dependenciaId },
      orderBy: { nombre: 'asc' },
    });
  }
}
