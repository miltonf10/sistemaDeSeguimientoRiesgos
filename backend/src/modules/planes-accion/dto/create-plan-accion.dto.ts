import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePlanAccionDto {
  @IsString()
  riesgoId: string;

  @IsString()
  descripcion: string;

  @IsString()
  responsableId: string;

  @IsDateString()
  fechaLimite: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
