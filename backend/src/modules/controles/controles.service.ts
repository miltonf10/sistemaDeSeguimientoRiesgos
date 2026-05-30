import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';

@Injectable()
export class ControlesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateControlDto) {
    return this.prisma.control.create({ data: dto });
  }

  async update(id: string, dto: UpdateControlDto) {
    const control = await this.prisma.control.findUnique({ where: { id } });
    if (!control) throw new NotFoundException('Control no encontrado');
    return this.prisma.control.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const control = await this.prisma.control.findUnique({ where: { id } });
    if (!control) throw new NotFoundException('Control no encontrado');
    return this.prisma.control.delete({ where: { id } });
  }

  async findByEvaluacion(evaluacionId: string) {
    return this.prisma.control.findMany({
      where: { evaluacionId },
      include: { responsable: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
