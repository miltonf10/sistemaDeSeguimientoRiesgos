import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  private excludePassword<T extends { passwordHash?: string }>(obj: T): Omit<T, 'passwordHash'> {
    const { passwordHash, ...rest } = obj;
    return rest;
  }

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({
      where: { activo: true },
      include: { dependencia: true },
      orderBy: { nombre: 'asc' },
    });
    return usuarios.map(u => this.excludePassword(u));
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { dependencia: true },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return this.excludePassword(usuario);
  }

  async create(dto: CreateUsuarioDto) {
    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await this.prisma.usuario.create({
      data: { ...rest, passwordHash },
    });
    return this.excludePassword(usuario);
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    const { password, ...rest } = dto;
    const data: any = { ...rest };
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data,
    });
    return this.excludePassword(usuario);
  }

  async remove(id: string) {
    await this.findOne(id);
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
    return this.excludePassword(usuario);
  }
}
