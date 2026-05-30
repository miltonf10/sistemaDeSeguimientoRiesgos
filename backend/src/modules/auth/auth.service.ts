import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { dependencia: true },
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    const accessToken = this.jwtService.sign(payload);
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret') || '';
    const refreshExp = this.configService.get<string>('jwt.refreshExpiration') || '7d';
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExp as `${number}${'s' | 'm' | 'h' | 'd'}`,
    });

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        dependencia: usuario.dependencia?.nombre || null,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const refreshSecret = this.configService.get<string>('jwt.refreshSecret') || '';
      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      }) as { sub: string; email: string; rol: string };

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
      });

      if (!usuario || !usuario.activo) {
        throw new UnauthorizedException('Usuario no autorizado');
      }

      const newPayload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async getProfile(userId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { dependencia: true },
    });
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    const { passwordHash, ...profile } = usuario;
    return profile;
  }
}
