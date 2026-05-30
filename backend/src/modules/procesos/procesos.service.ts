import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcesoDto } from './dto/create-proceso.dto';
import { UpdateProcesoDto } from './dto/update-proceso.dto';

@Injectable()
export class ProcesosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.proceso.findMany({
      where: { activo: true },
      include: { macroproceso: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const proceso = await this.prisma.proceso.findUnique({
      where: { id },
      include: { macroproceso: true },
    });
    if (!proceso) throw new NotFoundException('Proceso no encontrado');
    return proceso;
  }

  async create(dto: CreateProcesoDto) {
    return this.prisma.proceso.create({ data: dto });
  }

  async update(id: string, dto: UpdateProcesoDto) {
    await this.findOne(id);
    return this.prisma.proceso.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.proceso.update({
      where: { id },
      data: { activo: false },
    });
  }
}
