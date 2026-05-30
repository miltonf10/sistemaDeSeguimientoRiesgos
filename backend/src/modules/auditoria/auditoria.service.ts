import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.auditoria.findMany({
        skip,
        take: limit,
        include: { usuario: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditoria.count(),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.auditoria.findUnique({
      where: { id },
      include: { usuario: true },
    });
  }
}
