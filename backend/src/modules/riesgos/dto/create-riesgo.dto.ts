import { IsString, IsOptional, IsEnum } from 'class-validator';
import { EstadoRiesgo } from '@prisma/client';

export class CreateRiesgoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  causa: string;

  @IsString()
  consecuencia: string;

  @IsString()
  clasificacion: string;

  @IsString()
  @IsOptional()
  tipoRiesgo?: string;

  @IsEnum(EstadoRiesgo)
  @IsOptional()
  estado?: EstadoRiesgo;

  @IsString()
  procesoId: string;

  @IsString()
  activoId: string;
}
