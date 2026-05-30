import { IsString, IsInt, IsEnum, Min, Max, IsOptional } from 'class-validator';
import { TipoControl } from '@prisma/client';

export class CreateControlDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(TipoControl)
  tipoControl: TipoControl;

  @IsString()
  frecuencia: string;

  @IsInt()
  @Min(1)
  @Max(5)
  eficacia: number;

  @IsString()
  responsableId: string;

  @IsString()
  evaluacionId: string;
}
