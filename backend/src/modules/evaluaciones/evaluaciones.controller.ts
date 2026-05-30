import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '@prisma/client';

@Controller('evaluaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) {}

  @Get('riesgo/:riesgoId')
  findByRiesgo(@Param('riesgoId') riesgoId: string) {
    return this.evaluacionesService.findByRiesgo(riesgoId);
  }

  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  create(@Body() dto: CreateEvaluacionDto) {
    return this.evaluacionesService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.LIDER_PROCESO)
  update(@Param('id') id: string, @Body() dto: UpdateEvaluacionDto) {
    return this.evaluacionesService.update(id, dto);
  }
}
