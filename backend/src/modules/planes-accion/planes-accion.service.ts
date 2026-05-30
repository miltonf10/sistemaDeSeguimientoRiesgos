import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanAccionDto } from './dto/create-plan-accion.dto';
import { UpdatePlanAccionDto } from './dto/update-plan-accion.dto';

@Injectable()
export class PlanesAccionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.planAccion.findMany({
      include: {
        riesgo: true,
        responsable: true,
      },
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  async findByRiesgo(riesgoId: string) {
    return this.prisma.planAccion.findMany({
      where: { riesgoId },
      include: { responsable: true },
      orderBy: { fechaLimite: 'asc' },
    });
  }

  async create(dto: CreatePlanAccionDto) {
    return this.prisma.planAccion.create({
      data: {
        ...dto,
        fechaLimite: new Date(dto.fechaLimite),
      },
    });
  }

  async update(id: string, dto: UpdatePlanAccionDto) {
    const plan = await this.prisma.planAccion.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan de acción no encontrado');

    const data: any = { ...dto };
    if (dto.fechaLimite) {
      data.fechaLimite = new Date(dto.fechaLimite);
    }
    return this.prisma.planAccion.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const plan = await this.prisma.planAccion.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan de acción no encontrado');
    return this.prisma.planAccion.delete({ where: { id } });
  }
}
