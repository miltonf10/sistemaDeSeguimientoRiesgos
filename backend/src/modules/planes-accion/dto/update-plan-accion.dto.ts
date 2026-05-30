import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanAccionDto } from './create-plan-accion.dto';

export class UpdatePlanAccionDto extends PartialType(CreatePlanAccionDto) {}
