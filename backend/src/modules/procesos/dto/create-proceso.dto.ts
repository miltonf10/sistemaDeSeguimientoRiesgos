import { IsString, IsOptional } from 'class-validator';

export class CreateProcesoDto {
  @IsString()
  nombre: string;

  @IsString()
  nivel: string;

  @IsString()
  @IsOptional()
  objetivo?: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  macroprocesoId: string;
}
