import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateEvaluacionDto {
  @IsString()
  riesgoId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  probabilidad: number;

  @IsInt()
  @Min(1)
  @Max(5)
  impacto: number;

  @IsInt()
  @IsOptional()
  riesgoResidual?: number;

  @IsString()
  @IsOptional()
  nivelResidual?: string;

  @IsString()
  evaluadoPorId: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
