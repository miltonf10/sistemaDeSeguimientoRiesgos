import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  async riesgosPorProceso() {
    const procesos = await this.prisma.proceso.findMany({
      where: { activo: true },
      include: {
        _count: { select: { riesgos: true } },
      },
      orderBy: { nombre: 'asc' },
    });
    return procesos.map(p => ({
      proceso: p.nombre,
      codigo: p.codigo,
      totalRiesgos: p._count.riesgos,
    }));
  }

  async riesgosPorDependencia() {
    const dependencias = await this.prisma.dependencia.findMany({
      where: { activo: true },
      include: {
        macroprocesos: {
          include: {
            procesos: {
              include: {
                _count: { select: { riesgos: true } },
              },
            },
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
    return dependencias.map(d => ({
      dependencia: d.nombre,
      totalRiesgos: d.macroprocesos.reduce(
        (sum, m) => sum + m.procesos.reduce((s, p) => s + p._count.riesgos, 0),
        0
      ),
    }));
  }

  async riesgosAltos() {
    const evaluaciones = await this.prisma.evaluacionRiesgo.findMany({
      where: { riesgoInherente: { gte: 15 } },
      include: {
        riesgo: {
          include: {
            proceso: true,
            activo: true,
          },
        },
      },
      orderBy: { riesgoInherente: 'desc' },
    });
    return evaluaciones.map(e => ({
      riesgoId: e.riesgoId,
      riesgo: e.riesgo.nombre,
      proceso: e.riesgo.proceso.nombre,
      activo: e.riesgo.activo.nombre,
      probabilidad: e.probabilidad,
      impacto: e.impacto,
      riesgoInherente: e.riesgoInherente,
      fechaEvaluacion: e.fechaEvaluacion,
    }));
  }
}
