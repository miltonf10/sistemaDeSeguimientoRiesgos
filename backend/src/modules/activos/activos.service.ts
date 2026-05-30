import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';

@Injectable()
export class ActivosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.activo.findMany({
      where: { activo: true },
      include: { responsable: true, dependencia: true, macroproceso: true, subprocesoRel: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const activo = await this.prisma.activo.findUnique({
      where: { id },
      include: { responsable: true, dependencia: true, macroproceso: true, subprocesoRel: true },
    });
    if (!activo) throw new NotFoundException('Activo no encontrado');
    return activo;
  }

  async create(dto: CreateActivoDto) {
    return this.prisma.activo.create({ data: dto });
  }

  async update(id: string, dto: UpdateActivoDto) {
    await this.findOne(id);
    return this.prisma.activo.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.activo.update({
      where: { id },
      data: { activo: false },
    });
  }
}
