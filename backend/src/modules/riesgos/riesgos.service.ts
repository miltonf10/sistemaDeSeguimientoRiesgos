import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRiesgoDto } from './dto/create-riesgo.dto';
import { UpdateRiesgoDto } from './dto/update-riesgo.dto';

@Injectable()
export class RiesgosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.riesgo.findMany({
      include: {
        proceso: true,
        activo: true,
        evaluaciones: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const riesgo = await this.prisma.riesgo.findUnique({
      where: { id },
      include: {
        proceso: true,
        activo: true,
        evaluaciones: {
          include: {
            controles: true,
          },
        },
      },
    });
    if (!riesgo) throw new NotFoundException('Riesgo no encontrado');
    return riesgo;
  }

  async create(dto: CreateRiesgoDto) {
    return this.prisma.riesgo.create({ data: dto });
  }

  async update(id: string, dto: UpdateRiesgoDto) {
    await this.findOne(id);
    return this.prisma.riesgo.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.riesgo.delete({ where: { id } });
  }
}
