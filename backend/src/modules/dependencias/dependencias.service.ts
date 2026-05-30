import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDependenciaDto } from './dto/create-dependencia.dto';
import { UpdateDependenciaDto } from './dto/update-dependencia.dto';

@Injectable()
export class DependenciasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dependencia.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const dependencia = await this.prisma.dependencia.findUnique({
      where: { id },
    });
    if (!dependencia) throw new NotFoundException('Dependencia no encontrada');
    return dependencia;
  }

  async create(dto: CreateDependenciaDto) {
    return this.prisma.dependencia.create({ data: dto });
  }

  async update(id: string, dto: UpdateDependenciaDto) {
    await this.findOne(id);
    return this.prisma.dependencia.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.dependencia.update({
      where: { id },
      data: { activo: false },
    });
  }
}
