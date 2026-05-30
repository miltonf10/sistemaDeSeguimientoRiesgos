import { IsString, IsOptional } from 'class-validator';

export class CreateDependenciaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  codigo?: string;
}
