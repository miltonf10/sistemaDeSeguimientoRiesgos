import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';

@Injectable()
export class EvaluacionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEvaluacionDto) {
    const riesgoInherente = dto.probabilidad * dto.impacto;
    return this.prisma.evaluacionRiesgo.create({
      data: {
        ...dto,
        riesgoInherente,
      },
    });
  }

  async update(id: string, dto: UpdateEvaluacionDto) {
    const evaluacion = await this.prisma.evaluacionRiesgo.findUnique({ where: { id } });
    if (!evaluacion) throw new NotFoundException('Evaluación no encontrada');

    const probabilidad = dto.probabilidad ?? evaluacion.probabilidad;
    const impacto = dto.impacto ?? evaluacion.impacto;
    const riesgoInherente = probabilidad * impacto;

    return this.prisma.evaluacionRiesgo.update({
      where: { id },
      data: {
        ...dto,
        riesgoInherente,
      },
    });
  }

  async findByRiesgo(riesgoId: string) {
    return this.prisma.evaluacionRiesgo.findMany({
      where: { riesgoId },
      include: {
        evaluadoPor: true,
        controles: true,
      },
      orderBy: { fechaEvaluacion: 'desc' },
    });
  }
}
