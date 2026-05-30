import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Rol } from '@prisma/client';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  cargo?: string;

  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;

  @IsString()
  @IsOptional()
  dependenciaId?: string;
}
